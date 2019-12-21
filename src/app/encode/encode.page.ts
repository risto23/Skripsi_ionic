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
  selector: 'app-encode',
  templateUrl: './encode.page.html',
  styleUrls: ['./encode.page.scss'],
})

export class EncodePage implements OnInit {

  images = [];
  immages2=[];
  platform: any;
  crypter = false;
  cover :string;
  hidden :string;

  imagePickerOptions = {
    maximumImagesCount: 1,
    outputType: 1,
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
                text: 'Use Camera',
                handler: () => {
                    this.KameraGambarHidden();
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

async PilihGambarCover() {
  const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
              text: 'Load from Library',
              handler: () => {
                  this.GaleriGambarCover();
              }
          },
          {
              text: 'Use Camera',
              handler: () => {
                  this.KameraGambarCover();
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


KameraGambarHidden() {
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
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


    KameraGambarCover() {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.cover = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        // Handle error
        alert('Error in showing hidden image');
      });
      }
    
    GaleriGambarCover() {
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum:false
        }
        this.camera.getPicture(options).then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          this.cover = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
          // Handle error
          alert('Error in showing hidden image');
        });
        }
    
   
  
  ngOnInit() {
    
  }
  

deleteImage(imgEntry, position) {
  this.images.splice(position, 1);

  this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
          this.presentToast('File removed.');
      });
  });
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

  Cover = {
    el: null,
    context: null,
    init: function(){
      this.el = $('#cover')[0];
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

encode(){


	
	this.Crypter.changeLowerBitsToHigher();
	
	var result = this.Result.el.toDataURL();

	//result = result.replace('image/png', 'image/octet-stream');
  $('#result').ready(function(){
		$('.result').fadeIn();
		$('.gambar').fadeOut();
	});
	
	$('#result').attr({'src': result});

}

Crypter = {
	msb: 0,
	/**
	* @desc both source and container remains unchanged all the time (untill you drop another images)
	*       and only used as data source to calculate a new image data
	*/
	source: 0,      //what to hide (ImageData obj)
	container: 0,   //where to hide (ImageData obj)
	
	/**
	* @param bits: how many LOWER bits in container to replace
	*/
	changeLowerBitsToHigher: function(){
  //mengambil gambar sebagai hidden dari imageview
  this.source = this.Hidden.context.getImageData(0,0, this.Hidden.el.width, this.Hidden.el.height);
  //mengambil gambar sebagai cover dari imageview
  this.container = this.Cover.context.getImageData(0,0, this.cover.el.width, this.Cover.el.height);
		var dsrc = this.source;
		var dc = this.container;
		var d = this.Cover.context.getImageData(0, 0, this.Cover.el.width, this.Cover.el.height);
		var bits = 2;
		
		var offset = 8 - bits;
		var mask = (255 >> bits) << bits;
		
		//store bits in blue channel of the last pixel
		var last_pxl_blue = d.data[d.data.length-2];
		d.data[d.data.length-2] = ((last_pxl_blue >> 3) << 3) | bits;
		
		//encoding image dimensions
		var w = dsrc.width;
		var h = dsrc.height;
		var d_mask = 255 >> 5;
		var e_mask = ((255 >> 3) << 3);
		var src = w;
		for(var i = d.data.length-6,ctr=0; ctr < 8; i-=4,ctr++){
			if(ctr == 4) src = h;
			//replace 3 lower bits by 0
			d.data[i] &= e_mask;
			d.data[i] |= (src & d_mask);
			src >>= 3;
		}
		
		//begin from second (from end) pixel
		for(var i = 0; i < dsrc.data.length; i+=4){
			//set lower bits to zero
			d.data[i]   = dc.data[i]   & mask;    //red
			d.data[i+1] = dc.data[i+1] & mask;    //green
			d.data[i+2] = dc.data[i+2] & mask;    //blue
			
			//change lower bits to higher bits of source
			d.data[i]   |= (dsrc.data[i]   >> offset);
			d.data[i+1] |= (dsrc.data[i+1] >> offset);
			d.data[i+2] |= (dsrc.data[i+2] >> offset);
		}
		
		console.log('last pixel:', i); //this will be the next red value in the pixel after source image
		d.data[i+3] = 254;  //changing alpha of the last+1 pixel to mark the end of crypted message;
		
		this.Result.context.putImageData(d,0,0);
	},
};


}
