import os
results=[]
for root,dirs,files in os.walk('.'):
    for f in files:
        if f.endswith('.xlsx'):
            results.append(os.path.join(root,f))
with open('xlsx_list.txt','w',encoding='utf-8') as f:
    for r in results:
        f.write(r+'\n')
