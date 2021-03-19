import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-room-control-button',
  templateUrl: './room-control-button.component.html',
  styleUrls: ['./room-control-button.component.scss']
})
export class RoomControlButtonComponent implements OnInit {

  @Input() icon: string;
  @Input() label: string;
  
  @Output() clicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  click() {
    this.clicked.emit();
  }

}
