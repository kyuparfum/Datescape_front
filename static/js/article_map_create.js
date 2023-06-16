if (!localStorage.getItem("access")) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
}
// 대표 이미지 선택 시 미리보기
function getMainImageFiles(e) {
    const uploadFiles = [];
    const files = e.currentTarget.files;
    const imagePreview = document.querySelector('#main-image-preview');
    const docFrag = new DocumentFragment();

    // 파일 타입 검사
    [...files].forEach(file => {
        if (!file.type.match("image/.*")) {
            alert('이미지 파일만 업로드가 가능합니다.');
            return
        }

        // 파일 갯수 검사
        if ([...files].length < 2) {
            uploadFiles.push(file);
            const reader = new FileReader();
            imagePreview.innerHTML = ''
            reader.onload = (e) => {
                const preview = createElement(e, file);
                imagePreview.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}

const mainImageUpload = document.getElementById("main_image");
mainImageUpload.addEventListener('change', getMainImageFiles);



// 이미지 선택 시 미리보기
function getImageFiles(e) {
    const uploadFiles = [];
    const files = e.currentTarget.files;
    const imagePreview = document.querySelector('#image-preview');
    const docFrag = new DocumentFragment();

    if ([...files].length >= 10) {
        alert('이미지는 최대 9개 까지 업로드가 가능합니다.');
        return;
    }

    // 파일 타입 검사
    [...files].forEach(file => {
        if (!file.type.match("image/.*")) {
            alert('이미지 파일만 업로드가 가능합니다.');
            return
        }

        // 파일 갯수 검사
        if ([...files].length < 10) {
            uploadFiles.push(file);
            const reader = new FileReader();
            imagePreview.innerHTML = ''
            reader.onload = (e) => {
                const preview = createElement(e, file);
                imagePreview.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}

function createElement(e, file) {
    const div = document.createElement('div');
    div.setAttribute('class', 'col')
    const div2 = document.createElement('div');
    div2.setAttribute('style', 'height:150px; width:150px;')
    div.appendChild(div2)
    const img = document.createElement('img');
    img.setAttribute('src', e.target.result);
    img.setAttribute('class', 'cardimg img-thumbnail');
    img.setAttribute('data-file', file.name);
    div2.appendChild(img);

    return div;
}
const imageUpload = document.getElementById("images");
imageUpload.addEventListener('change', getImageFiles);

const searchInput = document.getElementById("tags");
const ul = document.getElementById("tag_ul")
let page_num = 0
// 문자열 형식
function testListTextGet() {
    let tagListText = ''
    const tagList = ul.childNodes
    for (let i = 1; i < tagList.length; i++) {
        tagListText += '#' + tagList[i].textContent
    }

    return tagListText
}

async function PostArticle() {
    // 데이터 전송을 위한 변수 선언
    const formData = new FormData();
    const data = document.getElementById("roadAddress").value;
    const title = document.getElementById("title").value;
    const image = document.getElementById("images").files;
    const main_image = document.getElementById("main_image").files;
    const content = document.getElementById("content").value;
    const score = document.getElementById("score").value;
    const tags = testListTextGet();
    //formData.append('query', data)
    formData.append('query', data);
    formData.append('title', title);
    formData.append('content', content);
    for (let i = 0; i < image.length; i++) {
        formData.append("images", image[i]);
    }
    for (let i = 0; i < image.length; i++) {
        formData.append("main_image", main_image[i]);
    }
    formData.append('score', score);
    formData.append('tags', tags);
    fetch(`${back_base_url}/articles/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "POST",
        body: formData,
    })
        .then(response => {
            console.log(response, "response")
            console.log(data, "data")
            if (!response.ok) {
                throw new Error('저장실패');
            }
            return document.getElementById("roadAddress").value;
        })
        .then(data => {
            console.log('data', data);
            console.log('저장완료', data);
            GetArticleId(page_num)
            alert("게시완료")
        })
        .catch(error => {
            console.error(error);
        });
}


window.onload = function () {
    // 엔터로 태그 추가
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // 엔터 키 입력
            let tagname = searchInput.value.trim()

            if (tagname == '') {
                alert('태그를 작성해주세요!')
            } else {
                if (tagname in testListTextGet().split('#')) {
                    searchInput.value = ''
                } else {
                    const tagli = document.createElement('li')
                    tagli.addEventListener('click', function () {
                        tagli.remove()
                    })
                    tagli.textContent = tagname
                    ul.appendChild(tagli)
                    searchInput.value = ''
                }
            }
        }
    });
    //주소가져오기
    //게시글을저장하면 작성한 게시글 페이지로 이동 시키기
    document.getElementById("roadAddress").addEventListener("click", function () { //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function (data) { //선택시 입력값 세팅
                document.getElementById("roadAddress").value = data.roadAddress // 도로명 주소 넣기
            }
        }).open()
    })
    const access = localStorage.getItem("access");
    async function GetArticleId(article_id) {
        const response = await fetch(`${back_base_url}/articles/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: 'GET',
        })
        const data = await response.json()
        page_num = data.count
        window.location.href = `${front_base_url}/templates/article_detail.html?id=${page_num}`
    }
    // GetArticleId(page_num)
    //저장
    document.querySelector('form').addEventListener("submit", event => { //주소입력칸을 클릭하면
        event.preventDefault();
        // // 데이터 전송을 위한 변수 선언
        const formData = new FormData();
        const data = document.getElementById("roadAddress").value;
        const title = document.getElementById("title").value;
        const image = document.getElementById("images").files;
        const main_image = document.getElementById("main_image").files;
        const content = document.getElementById("content").value;
        const score = document.getElementById("score").value;
        const tags = testListTextGet();
        //formData.append('query', data)
        formData.append('query', data);
        formData.append('title', title);
        formData.append('content', content);
        for (let i = 0; i < image.length; i++) {
            formData.append("images", image[i]);
        }
        for (let i = 0; i < image.length; i++) {
            formData.append("main_image", main_image[i]);
        }
        formData.append('score', score);
        formData.append('tags', tags);
        fetch(`${back_base_url}/articles/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "POST",
            body: formData,
        })
            .then(response => {
                console.log(response, "response")
                console.log(data, "data")
                if (!response.ok) {
                    throw new Error('저장실패');
                }
                return document.getElementById("roadAddress").value;
            })
            .then(data => {
                console.log('data', data);
                console.log('저장완료', data);
                GetArticleId(page_num)
                alert("게시완료")
            })
            .catch(error => {
                console.error(error);
            });

    })
}

