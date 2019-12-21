import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { IonicStorageModule } from '@ionic/storage'
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import * as $ from "jquery";

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-decode',
  templateUrl: './decode.page.html',
  styleUrls: ['./decode.page.scss'],
})
export class DecodePage implements OnInit {

  images = [];
  immages2=[];
  platform: any;
  crypter = false;
  cover :string;
  hidden :string;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(private camera: Camera, private file: File,private actionSheetController: ActionSheetController, private toastController: ToastController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath) { 
     
  }

  async PilihGambarSembunyi() {
    const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
                text: 'Load from Library',
                handler: () => {
                  this.GaleriGambarHidden();
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
}




GaleriGambarHidden() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.hidden = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
      alert('Error in showing hidden image');
    });
    }

  
  ngOnInit() {
    
  }
  
 
 
  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  Hidden = {
    el: null,
    context: null,
    init: function(){
      this.el = $('#hidden')[0];
      this.context = this.el.getContext('2d');
    },
  };


  Result = {
    el: null,
    context: null,
    init: function(){
      this.el = $('#result')[0];
      this.context = this.el.getContext('2d');
    },
  };

 

decrypt(){
  container: 0;
  var decrdata = 0;
	var dc = this.Hidden.context.getImageData(0, 0, this.Hidden.el.width, this.Hidden.el.height);;
	var bits = dc.data[dc.data.length-2] & 7;
	console.log('bits of color information:', bits);
	var offset = 8 - bits;
	var mask = 255 >> offset;
	
	//decrypt image dimensions (warning! below code is shit! Gonna rewrite it later)
	var w = 0, h = 0, rcv = 0;
	var d_mask = 255 >> 5;
	for(var i = dc.data.length - 6, ctr = 0; ctr < 4; ctr++, i-=4){
		w |= ((dc.data[i] & d_mask) << (3*ctr));
	}
	
	for(var i = dc.data.length - 22, ctr = 0; ctr < 4; ctr++, i-=4){
		h |= ((dc.data[i] & d_mask) << (3*ctr));
	}
	
	console.log('width, height:', w, h);
	
	var d = this.Hidden.context.createImageData(w, h);
	this.Hidden.el.width = w;
	this.Hidden.el.height = h;
	
	for(var i = 0; i < dc.data.length; i+=4){
		if(dc.data[i+3] == 254){ console.log('msg end, last pixel:', i); break; }
		d.data[i]   = (dc.data[i]   & mask) << offset;
		d.data[i+1] = (dc.data[i+1] & mask) << offset;
		d.data[i+2] = (dc.data[i+2] & mask) << offset;
		//SAVE ALPHA CHANNEL!
		d.data[i+3] = dc.data[i+3];
	}
	
	console.log('decryption ended, last i:', i, 'data[2] val:', d.data[2]);
	decrdata = d;
	this.Result.context.putImageData(d,0,0);
	var result = this.Result.el.toDataURL();

	//result = result.replace('image/png', 'image/octet-stream');
	
	
	$('#result').ready(function(){
		$('.result').fadeIn();
		$('.gambar').fadeOut();
	});
	
	$('#result').attr({'src': result});
}

}
