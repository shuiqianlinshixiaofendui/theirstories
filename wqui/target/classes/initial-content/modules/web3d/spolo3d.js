/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/
(function(){

		Spolo.selectedObj = null;
		Spolo.modelOperationMode = 1;
		Spolo.viewarea = null;
		Spolo.dataSync = null;
		Spolo.OperationMode = 1;
		Spolo.aroundObjOperationMode = false ;
		Spolo.browseViewOperationMode = false;
		Spolo.eventProcessor = {
			 onMove : false,
			 onDrag : false,
			 onPress : false 
			};
			
		//������ӽǣ�����free_viewΪĬ��״̬��
		Spolo.view_list = ["free_view", "front_view", "back_view", "left_view", "right_view", "top_view", "bottom_view"];
		Spolo.current_view = Spolo.view_list[0];//�������ǰ�ӽ�
		
		//ģ��ƽ�Ʒ�ʽ������or����������
		Spolo.transList = ["free","asis"];
		Spolo.current_trans=Spolo.transList[0];
		
		//�����״̬�б�
		Spolo.condition_list = ["free","rotate","trans","farnear"];
		Spolo.camera_condition = Spolo.condition_list[0]; //�������ǰ״̬
		
		//ģ�Ͳ���������־
		Spolo.modelSelectable = false;
		
		//a list of actions	
		// Spolo.actionModeList = ["translateX", "translateY", "translateZ", "translate", "rotateX","rotateY", "rotateZ", "rotate", "scaleX", "scaleY", "scaleZ", "scale"];
		Spolo.actionModeList = ["translate", "rotate", "scale"];
		//here we add a global variable to indicate current action mode among the action mode list
		//we let the transform to do translation as default
		Spolo.currentAction = Spolo.actionModeList[0];
		
		//a global variable indicate if the user need mesh locks
		Spolo.cameraLock = false;
		
		//global variable indicate current aspect of scene the camera is going to be located to
		//we represent the six aspects of a cube with digits starts from 1 to 6
		//we made 1 as default
		Spolo.camerLocateId = 1; //1 front, 2 back, 3 left 4 right, 5 up/above, 6 below
		
		//the front target matrix
		Spolo._front_tarMat;
		
		//the back target matrix 
		Spolo._back_tarMat;
		
		//the left target matrix 
		Spolo._left_tarMat;
		
		//the right target matrix 
		Spolo._right_tarMat;
		
		//the up target matrix 
		Spolo._up_tarMat;
		
		//the below target matrix 
		Spolo._below_tarMat;
		
		//wheather mouse in the model
		Spolo.isMouseInModel  = false;
        
        //����������İ�ť  
        Spolo.isToolbar = false ;
        // ������С
        Spolo.sceneSize = 1000;
        // mesh Object
        Spolo.mesh = null;
		// oldSelectedObj
		Spolo.oldSelectedObj = null;
})(); 
