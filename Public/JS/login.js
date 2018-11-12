$(document).ready(()=>{
    $("form").submit((e)=>{
        e.preventDefault();
        var userName= $("#inputUserName").val();
        var password=$("#inputPassword").val();
        var fdata = {userName,password};
        fdata=JSON.stringify(fdata);
        $.ajax({
            contentType: 'application/json',
            url: 'http://localhost:8088/api/users',
            type: 'POST',
            data: fdata,
            dataType: 'json',
            timeout: 10000
        }).done((res)=>{
            localStorage.setItem("key",res.access_token);
            if(res.user.staffRole === 2){
            window.location.replace("http://localhost:8088/contact");
            }
            else{
                alert("Fail");
            }
        }).catch(err =>{
            console.log("Co loi dkm");
            console.log(err);
        })
    })
})