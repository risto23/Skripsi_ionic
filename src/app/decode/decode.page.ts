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
  platform: any;


  constructor(private camera: Camera, private file: File,private actionSheetController: ActionSheetController, private toastController: ToastController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath) { 
     
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Use Camera',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
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
 
takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };
 
    this.camera.getPicture(options).then(imagePath => {
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(imagePath)
                .then(filePath => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                });
        } else {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
    });
  }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadStoredImages();
    });
  }
  
createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
}
 
copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        this.updateStoredImages(newFileName);
    }, error => {
        this.presentToast('Error while storing file.');
    });
}
updateStoredImages(name) {
  this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
          let newImages = [name];
          this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
          arr.push(name);
          this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
          name: name,
          path: resPath,
          filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
  });
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
  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }
 
  pathForImage(img) {
    if (img === null) {
      return '';
    } 
  }
 
  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  Handler = {
    el: null,
    context: null,
    init: function(){
      this.el = $('#handler')[0];
      this.context = this.el.getContext('2d');
    },
  };

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
      var dsrc = this.source;
      var dc = this.container;
      var d = this.Handler.context.getImageData(0, 0, this.Handler.el.width, this.Handler.el.height);
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
      
      this.Handler.context.putImageData(d,0,0);
    },
  };


decrypt(){
  container: 0;
  var decrdata = 0;
	var dc = this.Handler.context.getImageData(0, 0, this.Handler.el.width, this.Handler.el.height);;
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
	
	var d = this.Handler.context.createImageData(w, h);
	this.Handler.el.width = w;
	this.Handler.el.height = h;
	
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
	this.Handler.context.putImageData(d,0,0);
	var result = this.Handler.el.toDataURL();

	//result = result.replace('image/png', 'image/octet-stream');
	
	
	$('#result').ready(function(){
		$('.result').fadeIn();
		$('.gambar').fadeOut();
	});
	
	$('#result').attr({'src': result});
}

}
