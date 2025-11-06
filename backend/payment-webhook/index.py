'''
Business: Обработка webhook от ЮKassa для подтверждения успешной оплаты
Args: event - dict с httpMethod='POST', body содержит данные о платеже от ЮKassa
      context - объект с атрибутами request_id, function_name
Returns: HTTP response 200 для подтверждения получения webhook
'''

import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        event_type = body_data.get('event')
        payment_object = body_data.get('object', {})
        
        if event_type == 'payment.succeeded':
            payment_id = payment_object.get('id')
            user_id = payment_object.get('metadata', {}).get('user_id')
            amount = payment_object.get('amount', {}).get('value')
            
            print(f"Payment succeeded: payment_id={payment_id}, user_id={user_id}, amount={amount}")
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'status': 'success',
                    'message': 'Payment processed',
                    'payment_id': payment_id,
                    'user_id': user_id
                }),
                'isBase64Encoded': False
            }
        
        elif event_type == 'payment.canceled':
            payment_id = payment_object.get('id')
            print(f"Payment canceled: payment_id={payment_id}")
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'status': 'canceled',
                    'message': 'Payment canceled',
                    'payment_id': payment_id
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'status': 'received',
                'event_type': event_type
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }
