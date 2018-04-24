from crypto import aes
from crypto import pkcs7
from base64 import b64encode
from os import urandom

key='IVyA3Y6obxlKibzuxMX+BtkPSgpHkfu'
cipher_text='m\u009csz\u00ed\u0001\u008c+\u00b5\u00d9\u00b5\u0003\u0005[\u0095\u0094\u00ceu\t\u00fe\u00ba\u00f3\u0006\u009e\u00f0 \u00c7\u0018S:r\u00fc\u001a\u00ef\u0096\u00da\u00c8*\u0086^\u00f4\u009f\u00a2\u008a\u00f4-G\u00bcx\u00d2r\u001dg.z\u00dc\u0006\u00fe\u00fb\u00b3\u00e4\u0083`\u001d\u0084\u00dd\u008c\u001207\u00e7\u00fd\u00bff\u00c50\u00dc\u000eW\t'
encrypted_blocks = ''

decrypt_text = ""
encrypted_blocks = [cipher_text[i:i + 16] for i in range(0, len(cipher_text), 16)]
for i in range(0, len(encrypted_blocks)):
    block = aes.decrypt_block(encrypted_blocks[i], key)
    decrypt_text = decrypt_text + block

print(decrypt_text)