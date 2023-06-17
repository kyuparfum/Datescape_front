if (!localStorage.getItem("access")) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
}


// 이모티콘 생성
async function emoticonCreate() {
    const access = localStorage.getItem("access");

    const emoticonTitle = document.getElementById('title').value
    const emoticonImage = document.getElementById('image').files
    
    if (emoticonTitle == '') {
        alert('이모티콘 제목을 작성해주세요!')
    } else if (emoticonImage.length == 0){
        alert('이미지를 등록해주세요!')
    } else {
        const formData = new FormData();

        formData.append('title', emoticonTitle)
        for (let i = 0; i < emoticonImage.length; i++) {
            formData.append("images", emoticonImage[i]);
            console.log(emoticonImage[i].size)
            formData.append("file_size", emoticonImage[i].size);
        }

        const response = await fetch(`${back_base_url}/emoticons/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (response.status == 200) {
            alert('등록 완료!\n승인을 기다려 주세요')
            window.location.reload();
        } else if (response.status == 401) {
            alert("로그인한 사용자만 이용 가능합니다.");
        } else {
            alert("잘못 된 요청입니다.");
        }
    }
}


// 이모티콘 이미지파일만 받기
const imageInput = document.getElementById("image");

const acceptFile = ['xbm','tif','pjp','apng','svgz','jpg','jpeg','ico','tiff','gif','svg','jfif','webp','png','bmp','pjpeg','avif']

imageInput.addEventListener("change", function () {
    let fileList = imageInput.files;

    // 이미지 파일인지 검증
    for (let i = 0; i < fileList.length; i++) {
        let fileName = fileList[i].name.split('.')

        if(acceptFile.includes(fileName[fileName.length-1])){
        } else{
            alert(`이미지 파일만 가능합니다!\n가능 확장자명: ${acceptFile}`)
            imageInput.value = []
        }
    }
});


//////////////


function loadFile(input) {
    const container = document.getElementById('image-show');
    let num = container.childNodes.length
    for (let i = 0; i < num; i++) {
        container.childNodes[0].remove()
    }

    const files = input.files;
    console.log(files)

    for (let i = 0; i < files.length; i++) {
        console.log(files[i])

        var newImage = document.createElement("img");
        newImage.setAttribute("class", 'img');

        newImage.src = URL.createObjectURL(files[i]);   

        newImage.style.width = "100px";
        newImage.style.height = "100px";
        newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지 숨기기
        newImage.style.objectFit = "cover";

        container.appendChild(newImage);
    };

    const newImages = document.getElementById('image-show').childNodes
    for (let i = 0; i < newImages.length; i++) {
        newImages[i].style.visibility = "visible";
    }
};
