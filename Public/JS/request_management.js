$(document).ready(function () {
    $('.dropdown-item').click(function () {
        $('#dropdownMenuButton').text($(this).text());
        $( "#requestTable" ).load( "your-current-page.html #mytable" )
    })
})

