function md5(str) {
  function rotateLeft(n, s) { return (n << s) | (n >>> (32 - s)); }
  function addUnsigned(x, y) {
    const x8 = x & 0x80000000;
    const y8 = y & 0x80000000;
    const x4 = x & 0x40000000;
    const y4 = y & 0x40000000;
    const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
    if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8;
    if (x4 | y4) {
      if (result & 0x40000000) return result ^ 0xC0000000 ^ x8 ^ y8;
      else return result ^ 0x40000000 ^ x8 ^ y8;
    }
    return result ^ x8 ^ y8;
  }
  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | (~z)); }
  function FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function convertToWordArray(s) {
    let wordCount;
    const msgLen = s.length;
    const numberOfWords = ((msgLen + 8) - ((msgLen + 8) % 64)) / 64 + 1;
    const wordArray = new Array(numberOfWords * 16 - 1);
    let bytePosition = 0;
    let byteCount = 0;
    while (byteCount < msgLen) {
      wordCount = (byteCount - (byteCount % 4)) / 4;
      bytePosition = (byteCount % 4) * 8;
      wordArray[wordCount] = wordArray[wordCount] | (s.charCodeAt(byteCount) << bytePosition);
      byteCount++;
    }
    wordCount = (byteCount - (byteCount % 4)) / 4;
    bytePosition = (byteCount % 4) * 8;
    wordArray[wordCount] = wordArray[wordCount] | (0x80 << bytePosition);
    wordArray[numberOfWords * 16 - 2] = msgLen * 8;
    return wordArray;
  }
  function wordToHex(value) {
    let hex = '';
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 255;
      hex += ('0' + byte.toString(16)).slice(-2);
    }
    return hex;
  }
  const x = convertToWordArray(str);
  let a = 0x67452301;
  let b = 0xEFCDAB89;
  let c = 0x98BADCFE;
  let d = 0x10325476;
  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0], 7, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], 12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], 17, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], 22, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], 7, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], 12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], 17, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], 22, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], 7, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], 12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], 17, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], 22, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], 7, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], 12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], 17, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], 22, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], 5, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], 9, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], 14, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], 20, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], 5, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], 9, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], 14, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], 20, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], 5, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], 9, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], 14, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], 20, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], 5, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], 9, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], 14, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], 20, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], 4, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], 11, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], 16, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], 23, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], 4, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], 11, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], 16, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], 23, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], 4, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], 11, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], 16, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], 23, 0x04881D05);
    a = HH(a, b, c, d, x[k + 9], 4, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], 11, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], 16, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], 23, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], 6, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], 10, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], 15, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], 21, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], 6, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], 10, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], 15, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], 21, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], 6, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], 10, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], 15, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], 21, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], 6, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], 10, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], 15, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], 21, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

function getAvatarUrl(email) {
  if (!email) return 'https://api.dicebear.com/9.x/avataaars/svg?seed=default';
  const hash = md5(email.toLowerCase().trim());
  const seed = hash.substring(0, 8);
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function verifyAdmin(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/admin_token=([^;]+)/);
  if (!match) return false;
  const token = match[1];
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [tokenVal, timestamp, signature] = parts;
  const expectedSignature = await hmacSign(`${tokenVal}.${timestamp}`, env.SESSION_SECRET);
  if (signature !== expectedSignature) return false;
  const age = Date.now() - parseInt(timestamp, 10);
  if (age > 7 * 24 * 60 * 60 * 1000) return false;
  return true;
}

async function hmacSign(message, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateToken(env) {
  const token = btoa(crypto.getRandomValues(new Uint8Array(24)).toString())
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const timestamp = Date.now().toString();
  const signature = await hmacSign(`${token}.${timestamp}`, env.SESSION_SECRET);
  return `${token}.${timestamp}.${signature}`;
}

const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>留言板</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .gradient-text { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
    .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15); }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .admin-badge { background: linear-gradient(135deg, #f59e0b, #ef4444); }
  </style>
</head>
<body class="min-h-screen bg-gray-50">
  <div class="gradient-bg min-h-[200px] absolute top-0 left-0 right-0"></div>
  
  <div class="relative max-w-4xl mx-auto px-4 py-12">
    <header class="text-center mb-10 fade-in">
      <h1 class="text-4xl font-bold text-white mb-3 drop-shadow-lg">留言板</h1>
      <p class="text-white/80 text-lg">分享你的想法，与大家交流</p>
      <button id="adminBtn" class="absolute top-0 right-4 px-4 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition">管理员登录</button>
    </header>

    <div class="glass-card rounded-2xl shadow-xl p-6 mb-8 fade-in">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">发表留言</h2>
      <form id="messageForm" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">姓名</label>
            <input type="text" id="name" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" placeholder="请输入姓名" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">邮箱</label>
            <input type="email" id="email" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" placeholder="请输入邮箱" required>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">留言内容</label>
          <textarea id="content" rows="4" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none" placeholder="请输入留言内容" required></textarea>
        </div>
        <button type="submit" id="submitBtn" class="w-full gradient-bg text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition">提交留言</button>
      </form>
    </div>

    <div class="glass-card rounded-2xl shadow-xl p-6 fade-in">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">留言列表</h2>
      <div id="messageList" class="space-y-4">
        <div class="text-center text-gray-400 py-8">加载中...</div>
      </div>
      <div id="pagination" class="flex justify-center mt-6 space-x-2">
      </div>
    </div>

    <div id="adminModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">管理员登录</h3>
        <input type="password" id="adminPassword" class="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4" placeholder="请输入管理员密码">
        <div class="flex space-x-3">
          <button id="cancelLogin" class="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600">取消</button>
          <button id="submitLogin" class="flex-1 py-2 gradient-bg text-white rounded-lg">登录</button>
        </div>
      </div>
    </div>

    <div id="replyModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">回复留言</h3>
        <textarea id="replyContent" rows="4" class="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4" placeholder="请输入回复内容"></textarea>
        <div class="flex space-x-3">
          <button id="cancelReply" class="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600">取消</button>
          <button id="submitReply" class="flex-1 py-2 gradient-bg text-white rounded-lg">回复</button>
        </div>
      </div>
    </div>

    <footer class="text-center mt-10 text-gray-500 text-sm">
      <p>&copy; 2026 留言板 &middot; 使用 Cloudflare Workers 构建</p>
    </footer>
  </div>

  <script>
    let isAdmin = false;
    let currentPage = 1;
    let totalPages = 1;
    let replyMessageId = null;

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    async function loadMessages(page = 1) {
      currentPage = page;
      try {
        const res = await fetch(\`/api/messages?page=\${page}&limit=10\`);
        const data = await res.json();
        totalPages = data.totalPages;
        renderMessages(data.messages);
        renderPagination();
      } catch (e) {
        document.getElementById('messageList').innerHTML = '<div class="text-center text-red-400 py-8">加载失败</div>';
      }
    }

    function renderMessages(messages) {
      const list = document.getElementById('messageList');
      if (messages.length === 0) {
        list.innerHTML = '<div class="text-center text-gray-400 py-8">暂无留言</div>';
        return;
      }
      list.innerHTML = messages.map(msg => {
        let repliesHtml = '';
        if (msg.replies && msg.replies.length > 0) {
          repliesHtml = msg.replies.map(r => \`
            <div class="bg-purple-50 rounded-lg p-3 mt-3 ml-12">
              <div class="flex items-center mb-1">
                <div class="w-6 h-6 rounded-full admin-badge flex items-center justify-center text-white text-xs font-bold">管</div>
                <span class="text-xs text-gray-500 ml-2">管理员回复</span>
                <span class="text-xs text-gray-400 ml-auto">\${formatDate(r.created_at)}</span>
              </div>
              <p class="text-gray-700 text-sm">\${escapeHtml(r.content)}</p>
            </div>
          \`).join('');
        }
        const adminButtons = isAdmin ? \`
          <div class="flex space-x-2 mt-3">
            <button onclick="deleteMessage(\${msg.id})" class="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">删除</button>
            <button onclick="openReplyModal(\${msg.id})" class="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition">回复</button>
          </div>
        \` : '';
        return \`
          <div class="bg-white/80 rounded-xl p-5 border border-gray-100 hover-lift">
            <div class="flex items-start">
              <img src="\${msg.avatar_url}" alt="\${escapeHtml(msg.name)}" class="w-12 h-12 rounded-full object-cover mr-4 bg-gray-100">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-gray-800">\${escapeHtml(msg.name)}</span>
                  <span class="text-xs text-gray-400">\${formatDate(msg.created_at)}</span>
                </div>
                <p class="text-gray-700 leading-relaxed">\${escapeHtml(msg.content)}</p>
                \${repliesHtml}
                \${adminButtons}
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderPagination() {
      const pagination = document.getElementById('pagination');
      if (totalPages <= 1) { pagination.innerHTML = ''; return; }
      let html = '';
      html += \`<button class="px-3 py-1 rounded-lg text-sm \${currentPage > 1 ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}" onclick="changePage(\${currentPage - 1})" \${currentPage <= 1 ? 'disabled' : ''}>上一页</button>\`;
      for (let i = 1; i <= totalPages; i++) {
        html += \`<button class="px-3 py-1 rounded-lg text-sm \${i === currentPage ? 'gradient-bg text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}" onclick="changePage(\${i})">\${i}</button>\`;
      }
      html += \`<button class="px-3 py-1 rounded-lg text-sm \${currentPage < totalPages ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}" onclick="changePage(\${currentPage + 1})" \${currentPage >= totalPages ? 'disabled' : ''}>下一页</button>\`;
      pagination.innerHTML = html;
    }

    function changePage(page) {
      if (page < 1 || page > totalPages) return;
      loadMessages(page);
    }

    document.getElementById('messageForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = '提交中...';
      try {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const content = document.getElementById('content').value.trim();
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, content })
        });
        if (res.ok) {
          document.getElementById('name').value = '';
          document.getElementById('email').value = '';
          document.getElementById('content').value = '';
          loadMessages(1);
        } else {
          const data = await res.json();
          alert(data.error || '提交失败');
        }
      } catch (e) {
        alert('提交失败，请重试');
      }
      btn.disabled = false;
      btn.textContent = '提交留言';
    });

    document.getElementById('adminBtn').addEventListener('click', () => {
      if (isAdmin) {
        if (confirm('确定要退出登录吗？')) {
          fetch('/api/admin/logout', { method: 'POST' }).then(() => {
            isAdmin = false;
            document.getElementById('adminBtn').textContent = '管理员登录';
            loadMessages(currentPage);
          });
        }
      } else {
        document.getElementById('adminModal').classList.remove('hidden');
      }
    });

    document.getElementById('cancelLogin').addEventListener('click', () => {
      document.getElementById('adminModal').classList.add('hidden');
    });

    document.getElementById('submitLogin').addEventListener('click', async () => {
      const password = document.getElementById('adminPassword').value;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        if (res.ok) {
          isAdmin = true;
          document.getElementById('adminModal').classList.add('hidden');
          document.getElementById('adminPassword').value = '';
          document.getElementById('adminBtn').textContent = '退出登录';
          loadMessages(currentPage);
        } else {
          alert('密码错误');
        }
      } catch (e) {
        alert('登录失败');
      }
    });

    function openReplyModal(id) {
      replyMessageId = id;
      document.getElementById('replyContent').value = '';
      document.getElementById('replyModal').classList.remove('hidden');
    }

    document.getElementById('cancelReply').addEventListener('click', () => {
      document.getElementById('replyModal').classList.add('hidden');
    });

    document.getElementById('submitReply').addEventListener('click', async () => {
      const content = document.getElementById('replyContent').value.trim();
      if (!content) { alert('请输入回复内容'); return; }
      try {
        const res = await fetch(\`/api/messages/\${replyMessageId}/replies\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        if (res.ok) {
          document.getElementById('replyModal').classList.add('hidden');
          loadMessages(currentPage);
        } else {
          alert('回复失败');
        }
      } catch (e) {
        alert('回复失败');
      }
    });

    async function deleteMessage(id) {
      if (!confirm('确定要删除这条留言吗？')) return;
      try {
        const res = await fetch(\`/api/messages/\${id}\`, { method: 'DELETE' });
        if (res.ok) {
          loadMessages(currentPage);
        } else {
          alert('删除失败');
        }
      } catch (e) {
        alert('删除失败');
      }
    }

    async function checkAdmin() {
      try {
        const res = await fetch('/api/admin/status');
        isAdmin = res.ok;
        if (isAdmin) document.getElementById('adminBtn').textContent = '退出登录';
      } catch (e) {}
    }

    checkAdmin();
    loadMessages(1);
  </script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path === '/' || path === '/index.html') {
        return new Response(HTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      if (path === '/api/messages' && request.method === 'GET') {
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        const offset = (page - 1) * limit;

        const countResult = await env.DB.prepare('SELECT COUNT(*) as total FROM messages').first();
        const total = countResult.total;
        const totalPages = Math.ceil(total / limit) || 1;

        const messages = await env.DB.prepare(
          'SELECT id, name, email, content, avatar_url, created_at FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?'
        ).bind(limit, offset).all();

        for (const msg of messages.results) {
          const replies = await env.DB.prepare(
            'SELECT id, content, created_at FROM replies WHERE message_id = ? ORDER BY created_at ASC'
          ).bind(msg.id).all();
          msg.replies = replies.results;
          msg.avatar_url = getAvatarUrl(msg.email);
        }

        return Response.json({
          messages: messages.results,
          totalPages,
          currentPage: page,
          total
        });
      }

      if (path === '/api/messages' && request.method === 'POST') {
        const body = await request.json();
        const { name, email, content } = body;

        if (!name || !email || !content) {
          return Response.json({ error: '请填写完整信息' }, { status: 400 });
        }
        if (name.length > 50 || email.length > 100 || content.length > 1000) {
          return Response.json({ error: '内容过长' }, { status: 400 });
        }

        const avatarUrl = getAvatarUrl(email);

        await env.DB.prepare(
          'INSERT INTO messages (name, email, content, avatar_url) VALUES (?, ?, ?, ?)'
        ).bind(name, email, content, avatarUrl).run();

        return Response.json({ success: true });
      }

      const deleteMatch = path.match(/^\/api\/messages\/(\d+)$/);
      if (deleteMatch && request.method === 'DELETE') {
        const isAdmin = await verifyAdmin(request, env);
        if (!isAdmin) {
          return Response.json({ error: '无权限' }, { status: 401 });
        }
        const id = deleteMatch[1];
        await env.DB.prepare('DELETE FROM replies WHERE message_id = ?').bind(id).run();
        await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();
        return Response.json({ success: true });
      }

      const replyMatch = path.match(/^\/api\/messages\/(\d+)\/replies$/);
      if (replyMatch && request.method === 'POST') {
        const isAdmin = await verifyAdmin(request, env);
        if (!isAdmin) {
          return Response.json({ error: '无权限' }, { status: 401 });
        }
        const messageId = replyMatch[1];
        const body = await request.json();
        const { content } = body;
        if (!content || content.length > 1000) {
          return Response.json({ error: '内容无效' }, { status: 400 });
        }
        await env.DB.prepare(
          'INSERT INTO replies (message_id, content) VALUES (?, ?)'
        ).bind(messageId, content).run();
        return Response.json({ success: true });
      }

      if (path === '/api/admin/login' && request.method === 'POST') {
        const body = await request.json();
        const { password } = body;
        if (password === env.ADMIN_PASSWORD) {
          const token = await generateToken(env);
          return new Response(JSON.stringify({ success: true }), {
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
            }
          });
        }
        return Response.json({ error: '密码错误' }, { status: 401 });
      }

      if (path === '/api/admin/logout' && request.method === 'POST') {
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
          }
        });
      }

      if (path === '/api/admin/status' && request.method === 'GET') {
        const isAdmin = await verifyAdmin(request, env);
        if (isAdmin) {
          return Response.json({ isAdmin: true });
        }
        return Response.json({ error: '未登录' }, { status: 401 });
      }

      return Response.json({ error: 'Not Found' }, { status: 404 });
    } catch (error) {
      return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
  }
};
