//因为不会JS所有下面的代码都是DeepSeek写的（0v0）
// 替换为你的Firebase配置（项目设置中可以找到）
const firebaseConfig = {
    apiKey: "AIzaSyAbg6-v3k1nwFvnajn1FDEgu1Ci4yA6Bx8",
    authDomain: "ZJNewWorld.firebaseapp.com",
    projectId: "zjnewworld",
    storageBucket: "ZJNewWorld.appspot.com",
    messagingSenderId: "709672532557",
    appId: "709672532557"
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 监听登录状态
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('post-section').style.display = 'block';
        loadPosts();
    } else {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('post-section').style.display = 'none';
    }
});
// 注册功能
async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert("注册成功！");
    } catch (error) {
        alert("注册失败：" + error.message);
    }
}

// 登录功能
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        alert("登录失败：" + error.message);
    }
}

// 创建帖子
async function createPost() {
    const content = document.getElementById('postContent').value;
    const user = auth.currentUser;
    
    await db.collection('posts').add({
        content: content,
        author: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('postContent').value = "";
}

// 加载帖子
async function loadPosts() {
    const postsContainer = document.getElementById('posts');
    db.collection('posts')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
            postsContainer.innerHTML = "";
            snapshot.forEach(doc => {
                const post = doc.data();
                postsContainer.innerHTML += `
                    <div style="border: 1px solid #ccc; margin: 10px; padding: 10px">
                        <p>${post.content}</p>
                        <small>作者：${post.author} | 时间：${new Date(post.timestamp?.toDate()).toLocaleString()}</small>
                    </div>
                `;
            });
        });
}
