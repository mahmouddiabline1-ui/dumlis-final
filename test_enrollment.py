# -*- coding: utf-8 -*-
import urllib.request, json, sys, os, io

# Fix stdout encoding for Arabic
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

token = os.environ['TOKEN']
base = os.environ['BASE']
url = base + '/enrollments/20919'

data = json.dumps({'status': 'مسجل'}).encode('utf-8')
req = urllib.request.Request(url, data=data, method='PUT')
req.add_header('Authorization', 'Bearer ' + token)
req.add_header('Content-Type', 'application/json; charset=utf-8')

try:
    with urllib.request.urlopen(req) as resp:
        body = resp.read().decode('utf-8')
        d = json.loads(body)
        if d == {}:
            print('HTTP:200 RESULT: EMPTY{}')
        else:
            status_val = d.get('status', '?')
            keys = list(d.keys())
            print(f'HTTP:{resp.status} RESULT: PASS - id={d.get("id","?")}')
            print(f'status field value: {status_val}')
            print(f'Keys: {keys}')
except urllib.error.HTTPError as e:
    body = e.read().decode('utf-8')
    print(f'HTTP:{e.code} ERROR: {body[:500]}')
