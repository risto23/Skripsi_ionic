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
  selector: 'app-hasil',
  templateUrl: './hasil.page.html',
  styleUrls: ['./hasil.page.scss'],
})
export class HasilPage implements OnInit {

  constructor(private camera: Camera, private file: File,private actionSheetController: ActionSheetController, private toastController: ToastController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath) { }

  ngOnInit() {
  }

}
