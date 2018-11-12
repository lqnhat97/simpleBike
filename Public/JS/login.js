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
            method: 'POST',
            data: fdata,
            dataType: 'json',
            timeout: 10000
        }).done((res)=>{
            localStorage.setItem("key",res.access_token);
        })
    })
})