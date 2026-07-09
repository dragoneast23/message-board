const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>留言板</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .gradient-text { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
    .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15); }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .loading-spinner { border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; width: 24px; height: 24px; animation: spin 0.8s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body class="min-h-screen bg-gray-50">
  <div class="gradient-bg min-h-[200px] absolute top-0 left-0 right-0"></div>
  
  <div class="relative max-w-4xl mx-auto px-4 py-12">
    <header class="text-center mb-10 fade-in">
      <h1 class="text-4xl font-bold text-white mb-3 drop-shadow-lg">留言板</h1>
      <p class="text-white/80 text-lg">分享你的想法，与大家交流</p>
    </header>

    <div class="glass-card rounded-2xl shadow-xl p-6 mb-8 fade-in hover-lift">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        发表留言
      </h2>
      <form id="messageForm" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input type="text" id="name" required maxlength="50" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white" placeholder="请输入您的姓名">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input type="email" id="email" required maxlength="100" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white" placeholder="请输入您的邮箱">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">留言内容</label>
          <textarea id="content" required maxlength="500" rows="4" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white resize-none" placeholder="请输入您的留言..."></textarea>
          <p class="text-xs text-gray-400 mt-1 text-right"><span id="charCount">0</span>/500</p>
        </div>
        <button type="submit" id="submitBtn" class="w-full gradient-bg text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          提交留言
        </button>
      </form>
    </div>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
        留言列表
        <span id="totalCount" class="text-sm font-normal text-gray-500"></span>
      </h2>
      
      <div id="adminSection" class="hidden">
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600">管理员已登录</span>
          <button id="logoutBtn" class="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">退出登录</button>
        </div>
      </div>
      <div id="loginSection">
        <button id="showLoginBtn" class="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">管理员登录</button>
      </div>
    </div>

    <div id="loginModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">管理员登录</h3>
        <form id="loginForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input type="password" id="adminPassword" required class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
          </div>
          <button type="submit" id="loginBtn" class="w-full gradient-bg text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all">登录</button>
        </form>
        <button id="closeLoginBtn" class="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm">取消</button>
      </div>
    </div>

    <div id="messageList" class="space-y-4"></div>
    
    <div id="pagination" class="flex justify-center items-center gap-2 mt-8 hidden">
      <button id="prevPage" class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
      <span id="pageInfo" class="text-gray-600">第 1 页</span>
      <button id="nextPage" class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
    </div>

    <div id="loading" class="flex justify-center py-10 hidden">
      <div class="loading-spinner"></div>
    </div>

    <div id="emptyState" class="text-center py-16 hidden">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <p class="text-gray-500">暂无留言，快来发表第一条吧！</p>
    </div>
  </div>

  <div id="toast" class="fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all z-50"></div>

  <script>
    let currentPage = 1;
    const PAGE_SIZE = 10;
    let totalPages = 1;
    let isAdmin = false;

    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = \`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all z-50 \${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}\`;
      setTimeout(() => {
        toast.className = 'fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all z-50';
      }, 3000);
    }

    function md5Hash(str) {
      let hash = 0, i, chr;
      str = str.toLowerCase().trim();
      if (str.length === 0) return '0'.repeat(32);
      const len = str.length;
      const k = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc];
      const s = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
      const a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
      let a = a0, b = b0, c = c0, d = d0;
      const msg = new Array(Math.ceil(len / 64));
      for (let j = 0; j < msg.length; j++) {
        msg[j] = new Array(16);
        for (let k = 0; k < 16; k++) {
          const bytePos = j * 64 + k * 4;
          msg[j][k] = (bytePos + 3 < len ? str.charCodeAt(bytePos + 3) << 24 : 0) |
            (bytePos + 2 < len ? str.charCodeAt(bytePos + 2) << 16 : 0) |
            (bytePos + 1 < len ? str.charCodeAt(bytePos + 1) << 8 : 0) |
            (bytePos < len ? str.charCodeAt(bytePos) : 0);
        }
      }
      const bitLen = len * 8;
      msg[msg.length - 1][14] = (bitLen & 0xFFFFFFFF);
      msg[msg.length - 1][15] = (bitLen / 0x100000000) & 0xFFFFFFFF;
      for (let j = 0; j < msg.length; j++) {
        const M = msg[j];
        let AA = a, BB = b, CC = c, DD = d;
        for (let i = 0; i < 64; i++) {
          let f, g;
          if (i < 16) { f = (b & c) | (~b & d); g = i; }
          else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
          else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
          else { f = c ^ (b | ~d); g = (7 * i) % 16; }
          const temp = d;
          d = c;
          c = b;
          b = (b + ((a + f + k[i >>> 4] + M[g]) << s[i]) | ((a + f + k[i >>> 4] + M[g]) >>> (32 - s[i])));
          a = temp;
        }
        a += AA; b += BB; c += CC; d += DD;
      }
      const toHex = (n) => {
        let h = '';
        for (let i = 0; i < 4; i++) {
          h += ((n >> (8 * i)) & 0xFF).toString(16).padStart(2, '0');
        }
        return h;
      };
      return toHex(a) + toHex(b) + toHex(c) + toHex(d);
    }

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return \`\${minutes}分钟前\`;
      if (hours < 24) return \`\${hours}小时前\`;
      if (days < 7) return \`\${days}天前\`;
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    function escapeHtml(text) {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    async function loadMessages(page = 1) {
      const loading = document.getElementById('loading');
      const messageList = document.getElementById('messageList');
      const pagination = document.getElementById('pagination');
      const emptyState = document.getElementById('emptyState');
      const totalCount = document.getElementById('totalCount');

      loading.classList.remove('hidden');
      messageList.innerHTML = '';
      pagination.classList.add('hidden');
      emptyState.classList.add('hidden');

      try {
        const response = await fetch(\`/api/messages?page=\${page}&limit=\${PAGE_SIZE}\`);
        const data = await response.json();

        if (data.success) {
          currentPage = data.currentPage;
          totalPages = data.totalPages;

          if (data.messages.length === 0) {
            emptyState.classList.remove('hidden');
          } else {
            for (let i = 0; i < data.messages.length; i++) {
              const msg = data.messages[i];
              const card = document.createElement('div');
              card.className = 'glass-card rounded-xl shadow-md p-5 fade-in hover-lift';
              card.style.animationDelay = \`\${i * 0.05}s\`;
              
              const avatarUrl = msg.avatar_url || \`https://www.gravatar.com/avatar/\${await md5Hash(msg.email)}?d=identicon\`;
              
              let repliesHtml = '';
              if (msg.replies && msg.replies.length > 0) {
                repliesHtml = msg.replies.map(r => \`
                  <div class="mt-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-semibold text-purple-600">管理员回复</span>
                      <span class="text-xs text-gray-400">\${formatDate(r.created_at)}</span>
                    </div>
                    <p class="text-sm text-gray-700">\${escapeHtml(r.content)}</p>
                  </div>
                \`).join('');
              }

              const adminActions = isAdmin ? \`
                <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button onclick="showReplyForm(\${msg.id})" class="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    回复
                  </button>
                  <button onclick="deleteMessage(\${msg.id})" class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    删除
                  </button>
                </div>
              \` : '';

              card.innerHTML = \`
                <div class="flex gap-4">
                  <img src="\${avatarUrl}" alt="\${escapeHtml(msg.name)}" class="w-12 h-12 rounded-full object-cover bg-gray-200 flex-shrink-0">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                      <h3 class="font-semibold text-gray-800">\${escapeHtml(msg.name)}</h3>
                      <span class="text-sm text-gray-400">\${formatDate(msg.created_at)}</span>
                    </div>
                    <p class="text-gray-600 leading-relaxed">\${escapeHtml(msg.content)}</p>
                    \${repliesHtml}
                    \${adminActions}
                    <div id="replyForm-\${msg.id}" class="mt-3 hidden">
                      <textarea id="replyContent-\${msg.id}" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm mb-2" placeholder="输入回复内容..."></textarea>
                      <div class="flex gap-2">
                        <button onclick="submitReply(\${msg.id})" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">发送</button>
                        <button onclick="hideReplyForm(\${msg.id})" class="px-4 py-1.5 text-sm bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">取消</button>
                      </div>
                    </div>
                  </div>
                </div>
              \`;
              messageList.appendChild(card);
            }

            if (totalPages > 1) {
              pagination.classList.remove('hidden');
              document.getElementById('prevPage').disabled = currentPage === 1;
              document.getElementById('nextPage').disabled = currentPage === totalPages;
              document.getElementById('pageInfo').textContent = \`第 \${currentPage} / \${totalPages} 页\`;
            }
          }

          totalCount.textContent = \`(\${data.total} 条)\`;
        } else {
          showToast(data.message || '加载失败', 'error');
        }
      } catch (error) {
        showToast('网络错误', 'error');
      } finally {
        loading.classList.add('hidden');
      }
    }

    function showReplyForm(id) {
      document.getElementById(\`replyForm-\${id}\`).classList.remove('hidden');
      document.getElementById(\`replyContent-\${id}\`).focus();
    }

    function hideReplyForm(id) {
      document.getElementById(\`replyForm-\${id}\`).classList.add('hidden');
      document.getElementById(\`replyContent-\${id}\`).value = '';
    }

    async function submitReply(messageId) {
      const content = document.getElementById(\`replyContent-\${messageId}\`).value.trim();
      if (!content) {
        showToast('请输入回复内容', 'error');
        return;
      }

      try {
        const response = await fetch(\`/api/messages/\${messageId}/replies\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        const data = await response.json();

        if (data.success) {
          showToast('回复成功');
          hideReplyForm(messageId);
          loadMessages(currentPage);
        } else {
          showToast(data.message || '回复失败', 'error');
        }
      } catch (error) {
        showToast('网络错误', 'error');
      }
    }

    async function deleteMessage(id) {
      if (!confirm('确定要删除这条留言吗？')) return;

      try {
        const response = await fetch(\`/api/messages/\${id}\`, { method: 'DELETE' });
        const data = await response.json();

        if (data.success) {
          showToast('删除成功');
          if (currentPage > 1) {
            loadMessages(currentPage);
          } else {
            loadMessages(1);
          }
        } else {
          showToast(data.message || '删除失败', 'error');
        }
      } catch (error) {
        showToast('网络错误', 'error');
      }
    }

    document.getElementById('messageForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const content = document.getElementById('content').value.trim();

      if (!name || !email || !content) {
        showToast('请填写完整信息', 'error');
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="loading-spinner"></div> 提交中...';

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, content })
        });
        const data = await response.json();

        if (data.success) {
          showToast('留言成功');
          document.getElementById('messageForm').reset();
          document.getElementById('charCount').textContent = '0';
          loadMessages(1);
        } else {
          showToast(data.message || '留言失败', 'error');
        }
      } catch (error) {
        showToast('网络错误', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> 提交留言';
      }
    });

    document.getElementById('content').addEventListener('input', (e) => {
      document.getElementById('charCount').textContent = e.target.value.length;
    });

    document.getElementById('showLoginBtn').addEventListener('click', () => {
      document.getElementById('loginModal').classList.remove('hidden');
    });

    document.getElementById('closeLoginBtn').addEventListener('click', () => {
      document.getElementById('loginModal').classList.add('hidden');
      document.getElementById('adminPassword').value = '';
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('adminPassword').value;

      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        const data = await response.json();

        if (data.success) {
          isAdmin = true;
          document.getElementById('loginModal').classList.add('hidden');
          document.getElementById('adminPassword').value = '';
          document.getElementById('loginSection').classList.add('hidden');
          document.getElementById('adminSection').classList.remove('hidden');
          showToast('登录成功');
          loadMessages(currentPage);
        } else {
          showToast(data.message || '登录失败', 'error');
        }
      } catch (error) {
        showToast('网络错误', 'error');
      }
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
        isAdmin = false;
        document.getElementById('adminSection').classList.add('hidden');
        document.getElementById('loginSection').classList.remove('hidden');
        showToast('已退出登录');
        loadMessages(currentPage);
      } catch (error) {
        showToast('退出失败', 'error');
      }
    });

    document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
        loadMessages(currentPage - 1);
      }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
      if (currentPage < totalPages) {
        loadMessages(currentPage + 1);
      }
    });

    async function checkAdminStatus() {
      try {
        const response = await fetch('/api/admin/status');
        const data = await response.json();
        if (data.isAdmin) {
          isAdmin = true;
          document.getElementById('loginSection').classList.add('hidden');
          document.getElementById('adminSection').classList.remove('hidden');
        }
      } catch (error) {
        console.log('Failed to check admin status');
      }
    }

    checkAdminStatus();
    loadMessages(1);
  </script>
</body>
</html>`;

async function generateHmacSignature(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyHmacSignature(data, signature, secret) {
  const expectedSignature = await generateHmacSignature(data, secret);
  return expectedSignature === signature;
}

function generateSessionToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function computeMd5Hash(str) {
  str = str.toLowerCase().trim();
  if (str.length === 0) return '0'.repeat(32);
  const len = str.length;
  const k = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc];
  const s = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  let a = a0, b = b0, c = c0, d = d0;
  const msgLen = Math.ceil(len / 64);
  const msg = [];
  for (let j = 0; j < msgLen; j++) {
    msg[j] = [];
    for (let i = 0; i < 16; i++) {
      const bytePos = j * 64 + i * 4;
      msg[j][i] = (bytePos + 3 < len ? str.charCodeAt(bytePos + 3) << 24 : 0) |
        (bytePos + 2 < len ? str.charCodeAt(bytePos + 2) << 16 : 0) |
        (bytePos + 1 < len ? str.charCodeAt(bytePos + 1) << 8 : 0) |
        (bytePos < len ? str.charCodeAt(bytePos) : 0);
    }
  }
  const bitLen = len * 8;
  msg[msgLen - 1][14] = bitLen & 0xFFFFFFFF;
  msg[msgLen - 1][15] = (bitLen / 0x100000000) & 0xFFFFFFFF;
  for (let j = 0; j < msgLen; j++) {
    const M = msg[j];
    let AA = a, BB = b, CC = c, DD = d;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const temp = d;
      d = c;
      c = b;
      b = (b + ((a + f + k[i >>> 4] + M[g]) << s[i]) | ((a + f + k[i >>> 4] + M[g]) >>> (32 - s[i]))) | 0;
      a = temp;
    }
    a = (a + AA) | 0; b = (b + BB) | 0; c = (c + CC) | 0; d = (d + DD) | 0;
  }
  const toHex = (n) => {
    let h = '';
    for (let i = 0; i < 4; i++) {
      h += ((n >> (8 * i)) & 0xFF).toString(16).padStart(2, '0');
    }
    return h;
  };
  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.startsWith('/api/')) {
        return await handleApiRequest(request, env, ctx, url);
      }

      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        success: false,
        message: '服务器错误: ' + error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

async function handleApiRequest(request, env, ctx, url) {
  const path = url.pathname;
  const method = request.method;

  if (method === 'GET' && path === '/api/messages') {
    return await getMessages(request, env, url);
  }

  if (method === 'POST' && path === '/api/messages') {
    return await createMessage(request, env);
  }

  if (method === 'DELETE' && path.match(/^\/api\/messages\/(\d+)$/)) {
    const id = parseInt(path.match(/^\/api\/messages\/(\d+)$/)[1]);
    return await deleteMessage(request, env, id);
  }

  if (method === 'POST' && path.match(/^\/api\/messages\/(\d+)\/replies$/)) {
    const id = parseInt(path.match(/^\/api\/messages\/(\d+)\/replies$/)[1]);
    return await createReply(request, env, id);
  }

  if (method === 'POST' && path === '/api/admin/login') {
    return await adminLogin(request, env);
  }

  if (method === 'POST' && path === '/api/admin/logout') {
    return await adminLogout(request);
  }

  if (method === 'GET' && path === '/api/admin/status') {
    return await adminStatus(request, env);
  }

  return new Response(JSON.stringify({ success: false, message: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getMessages(request, env, url) {
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 10;
  const offset = (page - 1) * limit;

  try {
    const countResult = await env.DB.prepare('SELECT COUNT(*) as total FROM messages').first();
    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const messagesResult = await env.DB.prepare(`
      SELECT m.*, 
             (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', r.id, 'content', r.content, 'created_at', r.created_at)) 
              FROM replies r WHERE r.message_id = m.id) as replies_json
      FROM messages m 
      ORDER BY m.created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    const messages = messagesResult.results.map(msg => ({
      ...msg,
      replies: msg.replies_json ? JSON.parse(msg.replies_json) : []
    }));

    return new Response(JSON.stringify({
      success: true,
      messages,
      total,
      currentPage: page,
      totalPages
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch messages'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createMessage(request, env) {
  try {
    const body = await request.json();
    const { name, email, content } = body;

    if (!name || !email || !content) {
      return new Response(JSON.stringify({
        success: false,
        message: '请填写完整信息'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (name.length > 50 || email.length > 100 || content.length > 500) {
      return new Response(JSON.stringify({
        success: false,
        message: '输入内容过长'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedContent = content.trim();

    const emailHash = computeMd5Hash(trimmedEmail);
    const avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

    await env.DB.prepare(`
      INSERT INTO messages (name, email, content, avatar_url) 
      VALUES (?, ?, ?, ?)
    `).bind(trimmedName, trimmedEmail, trimmedContent, avatarUrl).run();

    return new Response(JSON.stringify({
      success: true,
      message: '留言成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: '留言失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function deleteMessage(request, env, id) {
  const isAdmin = await checkAdminAuth(request, env);
  if (!isAdmin) {
    return new Response(JSON.stringify({
      success: false,
      message: '需要管理员权限'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    await env.DB.prepare('DELETE FROM replies WHERE message_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({
      success: true,
      message: '删除成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: '删除失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createReply(request, env, messageId) {
  const isAdmin = await checkAdminAuth(request, env);
  if (!isAdmin) {
    return new Response(JSON.stringify({
      success: false,
      message: '需要管理员权限'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: '请输入回复内容'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trimmedContent = content.trim();

    await env.DB.prepare(`
      INSERT INTO replies (message_id, content) 
      VALUES (?, ?)
    `).bind(messageId, trimmedContent).run();

    return new Response(JSON.stringify({
      success: true,
      message: '回复成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: '回复失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function adminLogin(request, env) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new Response(JSON.stringify({
        success: false,
        message: '请输入密码'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({
        success: false,
        message: '密码错误'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = generateSessionToken();
    const timestamp = Date.now().toString();
    const signature = await generateHmacSignature(token + timestamp, env.SESSION_SECRET);
    const signedToken = `${token}.${timestamp}.${signature}`;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return new Response(JSON.stringify({
      success: true,
      message: '登录成功'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `admin_token=${signedToken}; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}`
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: '登录失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function adminLogout(request) {
  return new Response(JSON.stringify({
    success: true,
    message: '退出成功'
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin_token=; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  });
}

async function adminStatus(request, env) {
  const isAdmin = await checkAdminAuth(request, env);
  return new Response(JSON.stringify({
    success: true,
    isAdmin
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function checkAdminAuth(request, env) {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return false;
  
  const tokenMatch = cookie.match(/admin_token=([^;]+)/);
  if (!tokenMatch) return false;
  
  const signedToken = tokenMatch[1];
  const parts = signedToken.split('.');
  
  if (parts.length !== 3) return false;
  
  const [token, timestamp, signature] = parts;
  const isSignatureValid = await verifyHmacSignature(token + timestamp, signature, env.SESSION_SECRET);
  
  if (!isSignatureValid) return false;
  
  const tokenAge = Date.now() - parseInt(timestamp);
  if (tokenAge > 24 * 60 * 60 * 1000) return false;
  
  return true;
}