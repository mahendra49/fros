$(document).ready(function(){
   $(".commentsubmit").on("submit",function(e){
        e.preventDefault();
        // console.log(e);
        console.log($(this).serialize());

        console.log(e);
        var action1=e.currentTarget.action;
        
        $.ajax({
            url:action1,
            type:'post',
            dataType:'json',
            data: $(this).serialize(),
            success: function(data) {
               //$(this).trigger('reset');
               console.log(data);
               $(".commentslist").append("<li><b>"+data.username+" </b>"+data.comment+"</li>");
                 
            },
            error:function(err){
                console.log("error");
            }
        })
        $(this).trigger("reset");
       
        
   });
});






