(function(){
    require(
    [
        "widgets/CategorySelect/CategorySelect",
        "dojo/ready",
        "spolo/data/folder",
        "dojo/dom"
        
    ],
    function(CategorySelect,ready,Folder,dom)
    {
        ready(function(){
            function loadSelect(isroom){
                // var path = "/content/modellibcategory";
                if(isroom){
                    var path = "/content/roomlibcategory";
                    var firstCate = ["居室"];
                    var firstCateId = ["rroom"];
                    var arrar = [];
                }else{
                    var path = "/content/modellibcategory";
                    var firstCate = ["风格","居室","色系","品牌","nihao","主材"];
                    var firstCateId = ["style","room","colorSystem","brand","nihao","madeOf"];
                    var arrar = [];
                }
                Folder.getCategory
                    ({
                        path:path,
                        success:function(cateData)
                        {
                            for(var index = 0; index < cateData.length; index++){
                                arrar.push(cateData[index]);
                            }
                            for(var i = 0; i < firstCate.length; i++){
                                var childCate = getChildCate(firstCate[i],arrar);
                                if(childCate == null){
                                    continue;
                                }
                                var div = dom.byId(firstCateId[i]);
                                var type;
                                if(getIsRadio(firstCate[i],arrar)){
                                    type = "radio";
                                }else{
                                    type = "checkbox";
                                }
                                for(var j = 0; j < childCate.length; j ++){
                                    var resourceName = childCate[j].resourceName;
                                    var value = childCate[j].path;
                                    // console.log(firstCate[i]+" : "+resourceName+" "+value);
                                    if(isroom){
                                        div.innerHTML += "<div class=\"checkboxstyle\"><input name=\""+firstCateId[i]+"\" type=\""+type+"\" value=\""+value+"\" /><label >"+resourceName+" </label></div>"
                                    }else{
                                        div.innerHTML += "<div class=\"checkboxstyle\"><input name=\"m"+firstCateId[i]+"\" type=\""+type+"\" value=\""+value+"\" /><label >"+resourceName+" </label></div>"
                                    }
                                }
                                
                            }
                        },
                        failed:function(error)
                        {
                            console.log(error);
                        }
                    });
                console.log(arrar);
                
                function getChildCate(cate,arrar){
                    for(var k=0;k<arrar.length;k++){
                        if(arrar[k].resourceName == cate){
                            return arrar[k].catData;
                        }
                    }
                    return null;
                }
                
                function getIsRadio(cate,arrar){
                    for(var k=0;k<arrar.length;k++){
                        if(arrar[k].resourceName == cate){
                            return arrar[k].isradio;
                        }
                    }
                    return null;
                }
            };
        
            $('#furniture').click(function(){
                loadSelect(false);
                $("#boxStep0").css("display","none");
                $("#boxStep1").css("display","block");
            });
            $('#rooms').click(function(){
                loadSelect(true);
                $("#boxStep0").css("display","none");
                $("#boxStep_room1").css("display","block");
            });
            
            $("#step1_next").click(function(){
                $("#boxStep1").css("display","none");
                $("#boxStep2").css("display","block");
            });
            $("#step2_prev").click(function(){
                $("#boxStep2").css("display","none");
                $("#boxStep1").css("display","block");
            });
            $("#step2_next").click(function(){
                $("#boxStep2").css("display","none");
                $("#boxStep3").css("display","block");
            });
            $("#step3_prev").click(function(){
                $("#boxStep3").css("display","none");
                $("#boxStep2").css("display","block");
            });
            $("#step3_next").click(function(){
                $("#boxStep3").css("display","none");
                $("#boxStep4").css("display","block");
            });
            $("#step4_prev").click(function(){
                $("#boxStep4").css("display","none");
                $("#boxStep3").css("display","block");
            });
            $("#step4_next").click(function(){
                $("#boxStep4").css("display","none");
                $("#boxStep5").css("display","block");
            });
            $("#step5_prev").click(function(){
                $("#boxStep5").css("display","none");
                $("#boxStep4").css("display","block");
            });
            $('#choose1').click(function(){
                $('#highPoly').click();
            });
            $('#choose2').click(function(){
                $('#lowPoly').click();
            });
            $('#choose3').click(function(){
                $('#preview').click();
            });
            $("#clearForm").click(function(){
                $(':text').val("");
                $(':file').val("");
                $("select").val("1");
                $(':checkbox').attr('checked',false);
                $(':radio').attr('checked',false);
                $('#mprice')[0].value = 0;
                $('#mdescription')[0].value = "";
                
            });
            $('#highPoly').change(function(){
                var val = $('#highPoly')[0].value;
                $('#text1')[0].value = val;
                if($('#mname')[0].value==""){
                    $('#mname')[0].value = val.split("\\").pop().split(".")[0];
                }
            });
            $('#lowPoly').change(function(){
                $('#text2')[0].value = $('#lowPoly')[0].value;
            });
            $('#preview').change(function(){
                $('#text3')[0].value = $('#preview')[0].value;
            });
            
            $("#rclearForm").click(function(){
                $(':text').val("");
                $(':file').val("");
                $("select").val("1");
                $(':checkbox').attr('checked',false);
                $(':radio').attr('checked',false);
                $('#rarea')[0].value = 0;
                
            });
            $("#rstep1_next").click(function(){
                $("#boxStep_room1").css("display","none");
                $("#boxStep_room2").css("display","block");
            });
            $("#rstep2_next").click(function(){
                $("#boxStep_room2").css("display","none");
                $("#boxStep_room3").css("display","block");
            });
            $("#rstep2_prev").click(function(){
                $("#boxStep_room2").css("display","none");
                $("#boxStep_room1").css("display","block");
            });
            $("#rstep3_prev").click(function(){
                $("#boxStep_room3").css("display","none");
                $("#boxStep_room2").css("display","block");
            });
            $('#rhighPoly').change(function(){
                var val = $('#rhighPoly')[0].value;
                $('#rtext1')[0].value = val;
                if($('#rname')[0].value==""){
                    $('#rname')[0].value = val.split("\\").pop().split(".")[0];
                }
            });
            $('#rlowPoly').change(function(){
                $('#rtext2')[0].value = $('#rlowPoly')[0].value;
            });
            $('#rpreview').change(function(){
                $('#rtext3')[0].value = $('#rpreview')[0].value;
            });
            $('#rtext1').change(function(){
                $('#rhighPoly')[0].value = $('#rtext1')[0].value;
            });
            $('#rtext2').change(function(){
                $('#rlowPoly')[0].value = $('#rtext2')[0].value;
            });
            $('#rchoose1').click(function(){
                $('#rhighPoly').click();
            });
            $('#rchoose2').click(function(){
                $('#rlowPoly').click();
            });
            $('#rchoose3').click(function(){
                $('#rpreview').click();
            });
        
        
        });
       
        
    });
})();