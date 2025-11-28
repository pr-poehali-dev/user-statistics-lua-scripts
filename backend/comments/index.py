'''
Business: Manages comments on scripts and forum topics
Args: event with httpMethod, body (script_id/topic_id, author_id, content)
Returns: HTTP response with comments list or created comment
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            script_id = params.get('script_id')
            topic_id = params.get('topic_id')
            
            if script_id:
                cur.execute("""
                    SELECT c.*, u.username as author_name, u.rank
                    FROM script_comments c
                    JOIN users u ON c.author_id = u.id
                    WHERE c.script_id = %s
                    ORDER BY c.created_at DESC
                """, (script_id,))
                comments = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'comments': comments}, default=str),
                    'isBase64Encoded': False
                }
            
            elif topic_id:
                cur.execute("""
                    SELECT r.*, u.username as author_name, u.rank
                    FROM forum_replies r
                    JOIN users u ON r.author_id = u.id
                    WHERE r.topic_id = %s
                    ORDER BY r.created_at ASC
                """, (topic_id,))
                replies = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'replies': replies}, default=str),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'script_id or topic_id required'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            comment_type = body.get('type', 'script')
            author_id = body.get('author_id')
            content = body.get('content', '').strip()
            
            if not author_id or not content:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'author_id and content are required'}),
                    'isBase64Encoded': False
                }
            
            if comment_type == 'script':
                script_id = body.get('script_id')
                
                if not script_id:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'script_id is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    INSERT INTO script_comments (script_id, author_id, content)
                    VALUES (%s, %s, %s)
                    RETURNING id, script_id, author_id, content, created_at
                """, (script_id, author_id, content))
                
                comment = dict(cur.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'comment': comment}, default=str),
                    'isBase64Encoded': False
                }
            
            elif comment_type == 'forum':
                topic_id = body.get('topic_id')
                
                if not topic_id:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'topic_id is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    INSERT INTO forum_replies (topic_id, author_id, content)
                    VALUES (%s, %s, %s)
                    RETURNING id, topic_id, author_id, content, created_at
                """, (topic_id, author_id, content))
                
                reply = dict(cur.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'reply': reply}, default=str),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid type'}),
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
