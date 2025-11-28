'''
Business: Manages forum topics - create, read, update status (open/close)
Args: event with httpMethod, body (title, author_id, status)
Returns: HTTP response with topic data or topics list
'''
import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    conn = None
    cur = None
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            topic_id = params.get('id')
            
            if topic_id:
                cur.execute("""
                    SELECT t.*, u.username as author_name,
                           (SELECT COUNT(*) FROM forum_replies WHERE topic_id = t.id) as replies
                    FROM forum_topics t
                    JOIN users u ON t.author_id = u.id
                    WHERE t.id = %s
                """, (topic_id,))
                topic = cur.fetchone()
                
                if not topic:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Topic not found'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("UPDATE forum_topics SET views = views + 1 WHERE id = %s", (topic_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'topic': dict(topic)}, default=str),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT t.*, u.username as author_name,
                       (SELECT COUNT(*) FROM forum_replies WHERE topic_id = t.id) as replies
                FROM forum_topics t
                JOIN users u ON t.author_id = u.id
                ORDER BY t.created_at DESC
                LIMIT 50
            """)
            topics = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'topics': topics}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            title = body.get('title', '').strip()
            author_id = body.get('author_id')
            
            if not title or not author_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'title and author_id are required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO forum_topics (title, author_id)
                VALUES (%s, %s)
                RETURNING id, title, author_id, status, views, created_at
            """, (title, author_id))
            
            topic = dict(cur.fetchone())
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'success': True, 'topic': topic}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            topic_id = body.get('topic_id')
            status = body.get('status')
            
            if not topic_id or status not in ['open', 'closed']:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'topic_id and valid status required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE forum_topics SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
                (status, topic_id)
            )
            
            topic = cur.fetchone()
            
            if not topic:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Topic not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'topic': dict(topic)}, default=str),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
