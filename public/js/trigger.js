//comment ajax
//second argument is for adding the event to future elements(dynamicallt loaded ajax)
$(document).ready(function(){
   $("#posts-container").on("submit",".commentsubmit",function(e){
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

    $("#profile-picture-upload-form").on("submit",function(e){
        
        
        e.preventDefault();

        var formData = new FormData(this);
        var files=document.getElementById('profile-file-input').files[0];
        if(files){
           $.ajax({
                url:e.currentTarget.action,
                type:'post',
                cache:false,
                contentType:false,
                processData:false,
                data: formData,
                success: (data) => {
                    console.log("success");
                    var output = document.getElementById('profile-image-display');
                    output.src = URL.createObjectURL(profilechangeevent.target.files[0]);
                },
                error:function(err){
                    console.log("error");
                }
            }); 
        }
        
        
    });

    $(".showfullpost").on("click",function(e){
        console.log(e.currentTarget.nextElementSibling.innerHTML);
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

function profilepicture() {
    var x = document.getElementById("profile-picture-upload");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

var profilechangeevent;
var loadFile = function(event) {
    profilechangeevent=event;
};
