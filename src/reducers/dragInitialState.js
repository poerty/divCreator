export const dragInitialState={
    boxSourceList:{
//{id:1, top:300, left:50, width:100, height:100},,,,
        1:{width:264, height:96, dragImgSrc:"./img/1.png"
        },
        2:{width:140, height:140, dragImgSrc:"./img/2.png",
        borderRadius:"50%"
        }
    },
    boxIds:[
        1112,1113,1116
    ],
    boxList:{
//{id:1112, top:300, left:550, width:100, height:100},,,,
        1112:{top:300, left:50, width:100, height:100},
        1113:{top:100, left:100, width:100, height:100},
        1116:{
            top:150, left:250, width:200, height:300, background:"orange",
            childBoxList:{
                1114:{top:"10%", left:"10%", width:"50%", height:"50%"},
                1115:{top:"66.66%", left:"25%", width:"25%", height:"33.33%"}
            }
        }
    },
    selectedBoxIdList:[
//{id:1111},,,,
    ],
    targetBox:{top:-1,left:-1,width:0,height:0,x:-1,y:-1,realTop:-1,realLeft:-1,realWidth:0,realHeight:0},
    idCount:1117,
    snapLine:{top:-1,bottom:-1,left:-1,right:-1},
    layout:{
        top: 50,
        bottom: 50,
        left: 250,
        right: 250,
        screenWindow: typeof window === 'object' ? window.innerWidth : null,
        screenHeight: typeof window === 'object' ? window.innerHeight : null,
    }
}