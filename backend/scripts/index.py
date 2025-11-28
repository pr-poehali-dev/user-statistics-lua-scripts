'''
Business: Manages Lua scripts - create, read, update, like, download
Args: event with httpMethod, body (title, code, category, author_id)
Returns: HTTP response with script data or list of scripts
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
            category = params.get('category')
            author_id = params.get('author_id')
            script_id = params.get('id')
            
            if script_id:
                cur.execute("""
                    SELECT s.*, u.username as author_name 
                    FROM scripts s 
                    JOIN users u ON s.author_id = u.id 
                    WHERE s.id = %s
                """, (script_id,))
                script = cur.fetchone()
                
                if not script:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Script not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'script': dict(script)}, default=str),
                    'isBase64Encoded': False
                }
            
            query = """
                SELECT s.id, s.title, s.category, s.code, s.description, 
                       s.likes, s.downloads, s.created_at, u.username as author_name, s.author_id
                FROM scripts s
                JOIN users u ON s.author_id = u.id
            """
            query_params = []
            
            if category:
                query += " WHERE s.category = %s"
                query_params.append(category)
            elif author_id:
                query += " WHERE s.author_id = %s"
                query_params.append(author_id)
            
            query += " ORDER BY s.created_at DESC LIMIT 50"
            
            cur.execute(query, query_params)
            scripts = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'scripts': scripts}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create':
                title = body.get('title', '').strip()
                code = body.get('code', '').strip()
                category = body.get('category', '').strip()
                description = body.get('description', '').strip()
                author_id = body.get('author_id')
                
                if not title or not code or not category or not author_id:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Title, code, category and author_id are required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    INSERT INTO scripts (title, code, category, description, author_id)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, title, code, category, description, author_id, likes, downloads, created_at
                """, (title, code, category, description, author_id))
                
                script = dict(cur.fetchone())
                
                cur.execute("UPDATE users SET reputation = reputation + 10 WHERE id = %s", (author_id,))
                
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'script': script}, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'like':
                script_id = body.get('script_id')
                user_id = body.get('user_id')
                
                if not script_id or not user_id:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'script_id and user_id are required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "INSERT INTO script_likes (script_id, user_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (script_id, user_id)
                )
                
                if cur.rowcount > 0:
                    cur.execute("UPDATE scripts SET likes = likes + 1 WHERE id = %s", (script_id,))
                    cur.execute("SELECT author_id FROM scripts WHERE id = %s", (script_id,))
                    author = cur.fetchone()
                    if author:
                        cur.execute("UPDATE users SET reputation = reputation + 1 WHERE id = %s", (author['author_id'],))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'download':
                script_id = body.get('script_id')
                
                if not script_id:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'script_id is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("UPDATE scripts SET downloads = downloads + 1 WHERE id = %s", (script_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid action'}),
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
