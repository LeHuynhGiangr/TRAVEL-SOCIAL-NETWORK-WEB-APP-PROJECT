import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-meta',
  templateUrl: './post-meta.component.html',
  styleUrls: ['./post-meta.component.css']
})
export class PostMetaComponent implements OnInit {
  @Input() content:string;
  @Input() imageUri:string;
  constructor() { }

  ngOnInit(): void {
  }

}
