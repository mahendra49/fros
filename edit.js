//wall save

<div >
                    <h2>username: <%=post.author.username%></h2>    
                    <!-- body of post -->
                    <div >
                        <p><%=post.body%></p>
                    </div>
                    <button >like(<%=post.likes %>)</button>
                    <button>dislike((<%=post.dislikes %>))</button>
                    
                    <%post.comments.forEach(function(comment){%>
                        <h6><%=comment.text%></h6>
                    <%});%>    
                    
                    <!-- //add comment here try for ajax here  -->
                    <a class="btn btn-primary" href="/comment/<%=post._id%>">Comment</a>
                </div>

                <hr/>