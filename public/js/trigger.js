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


//likes ajax
function likepost(id,id_1){
        
    //console.log(id_1);    
    var url="/posts/like/"+id;
    console.log(url);
    var xmlreq = new XMLHttpRequest();
    xmlreq.open("POST",url,true);
    xmlreq.setRequestHeader('Content-type','application/json; charset=utf-8'); 
    var data = {
        postid:id
    }
    var json=JSON.stringify(data);

    xmlreq.onreadystatechange = function(){
        if(xmlreq.readyState==4 && xmlreq.status=="200"){
            var res=JSON.parse(xmlreq.responseText);
            if(res.ok==="1"){
                console.log(res);
                var val=id_1.querySelector("span");
                val.textContent=Number(val.textContent)+1;
            }
        }else{
            console.log("error")
        }
    };

    xmlreq.send(json);
 } 

  


