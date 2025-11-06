'''
Business: Создание платежа в ЮKassa для Premium подписки
Args: event - dict с httpMethod='POST', body содержит user_id и email
      context - объект с атрибутами request_id, function_name
Returns: HTTP response с confirmation_url для оплаты
'''

import json
import os
import uuid
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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
    
    shop_id = os.environ.get('YUKASSA_SHOP_ID')
    secret_key = os.environ.get('YUKASSA_SECRET_KEY')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Payment credentials not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    user_id = body_data.get('user_id', str(uuid.uuid4()))
    email = body_data.get('email', '')
    
    idempotence_key = str(uuid.uuid4())
    
    payment_data = {
        'amount': {
            'value': '199.00',
            'currency': 'RUB'
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': body_data.get('return_url', 'https://example.com/success')
        },
        'capture': True,
        'description': 'Premium подписка - Универсальный Переводчик (1 месяц)',
        'metadata': {
            'user_id': user_id,
            'subscription_type': 'premium_monthly'
        }
    }
    
    if email:
        payment_data['receipt'] = {
            'customer': {
                'email': email
            },
            'items': [{
                'description': 'Premium подписка (1 месяц)',
                'quantity': '1.00',
                'amount': {
                    'value': '199.00',
                    'currency': 'RUB'
                },
                'vat_code': 1
            }]
        }
    
    try:
        response = requests.post(
            'https://api.yookassa.ru/v3/payments',
            json=payment_data,
            auth=(shop_id, secret_key),
            headers={
                'Idempotence-Key': idempotence_key,
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            payment_info = response.json()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'payment_id': payment_info['id'],
                    'confirmation_url': payment_info['confirmation']['confirmation_url'],
                    'status': payment_info['status']
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Payment creation failed',
                    'details': response.text
                }),
                'isBase64Encoded': False
            }
    
    except Exception as e:
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
