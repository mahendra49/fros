$(document).ready(function(){
   $(".commentsubmit").on("submit",function(e){
        e.preventDefault();
        var action1=e.currentTarget.action;
        $.ajax({
            url:action1,
            type:'post',
            dataType:'json',
            data: $(this).serialize(),
            success: (data) => {
                $(this).closest('.commentsubmit').parent().find("ul").append("<li><b>"+data.username+" </b>"+data.comment+"</li>");
            },
            error:function(err){
                console.log("error");
            }
        });
        $(this).trigger("reset");
       
    });
});




