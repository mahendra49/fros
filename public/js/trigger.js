$(document).ready(function(){
   $("#commentsubmit").on("submit",function(e){
        e.preventDefault();
        var action1=e.currentTarget.action;
        
        //console.log($("#currentsubmit").serialize());
        
        $.ajax({
            url:action1,
            type:'post',
            dataType:'json',
            data: $(this).serialize(),
            success: function(data) {
                console.log(data);
                $(".commentslist").append("<li><b>"+data.username+" </b>"+data.comment+"</li>");
                //$("#commentsubmit")[0].reset(); 
            },
            error:function(err){
                console.log("error");
            }
        });

        $("#commentsubmit")[0].reset();
   });
});