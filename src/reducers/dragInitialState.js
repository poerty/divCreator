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
        1112,1113,1114
    ],
    boxList:{
//{id:1112, top:300, left:550, width:100, height:100},,,,
        1112:{top:300, left:50, width:100, height:100},
        1113:{top:100, left:100, width:100, height:100},
        1114:{top:120, left:120, width:300, height:400}
    },
    selectedBoxIdList:[
//{id:1111},,,,
    ],
    targetBox:{top:-1,left:-1,width:0,height:0,x:-1,y:-1,realTop:-1,realLeft:-1,realWidth:0,realHeight:0},
    idCount:1115,
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