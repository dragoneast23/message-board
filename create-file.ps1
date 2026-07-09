$content = @"
const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>留言板</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-50">
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-purple-600">留言板</h1>
    
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">发表留言</h2>
      <form id="form" class="space-y-4">
        <input type="text" id="name" class="w-full px-4 py-2 border rounded-lg" placeholder="姓名">
        <input type="email" id="email" class="w-full px-4 py-2 border rounded-lg" placeholder="邮箱">
        <textarea id="content" rows="3" class="w-full px-4 py-2 border rounded-lg" placeholder="留言内容"></textarea>
        <button type="submit" class="w-full bg-purple-600 text-white py-2 rounded-lg">提交</button>
      </form>
    </div>

    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">留言列表</h2>
      <div id="list" class="space-y-4"></div>
    </div>
  </div>

  <script>
    const mock = [
      {id:1,name:"张三",email:"a@test.com",content:"欢迎留言！",time:"2026-07-09 10:00"},
      {id:2,name:"李四",email:"b@test.com",content:"测试留言板功能",time:"2026-07-09 11:00"}
    ];
    let msgs = [...mock];

    function render() {
      const list = document.getElementById("list");
      list.innerHTML = msgs.map(m => `<div class="border-b pb-4"><div class="flex items-center justify-between"><span class="font-semibold">${m.name}</span><span class="text-xs text-gray-400">${m.time}</span></div><p class="mt-2 text-gray-700">${m.content}</p></div>`).join("");
    }

    document.getElementById("form").onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const content = document.getElementById("content").value;
      if(name && email && content) {
        msgs.unshift({id:Date.now(), name, email, content, time:new Date().toLocaleString()});
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("content").value = "";
        render();
      }
    };

    render();
  </script>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(HTML, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};
"@
Set-Content -Path "c:\Users\Administrator\Desktop\web\myweb\github\src\index.js" -Value $content -Encoding UTF8
