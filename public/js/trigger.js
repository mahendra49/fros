$(document).ready(function(){
   $(".commentsubmit").on("submit",function(e){
        e.preventDefault();
       // console.log(e);


        var action1=e.currentTarget.action;
        
        $(this).trigger("reset");
        $.ajax({
            url:action1,
            type:'post',
            dataType:'json',
            data: $(this).serialize(),
            success: function(data) {
               //$(this).trigger('reset');
               //console.log("here");
               $(".commentslist").append("<li><b>"+data.username+" </b>"+data.comment+"</li>");
                 
            },
            error:function(err){
                console.log("error");
            }
        })
        
       
        
   });
});






