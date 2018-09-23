//comment ajax
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

//stack overflow for lading ajax on scrool
var processing;
$(document).scroll(function(e){

    if (processing)
        return false;

    if ($(window).scrollTop() >= ($(document).height() - $(window).height())*0.7){
        processing = true;
        //get last element of class card-post and get the timestamp to query(loadajax)
        var lastPostTime=document.querySelectorAll(".card-post:last-child .time-stamp")[0].innerHTML;
        var data={"timestamp":lastPostTime};
        $.ajax({
            url:"/posts/loadpost",
            type:"post",
            contentType: "application/json",
            data:JSON.stringify(data),
            success:(posts)=>{
                if(posts.length==0){
                    processing=true;
                }
                else{
                    let cardPostInnerhtml = new EJS({url: 'templates/feed_template.ejs'}).render({posts:posts});
                    $("#posts-container").append(cardPostInnerhtml);
                    processing=false;
                }
                
            },
            error:()=>{
                console.log("error");
            }

        });
    }
});

 

  


