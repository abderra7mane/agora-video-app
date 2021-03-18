import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-room-control-toggle',
  templateUrl: './room-control-toggle.component.html',
  styleUrls: ['./room-control-toggle.component.scss']
})
export class RoomControlToggleComponent implements OnInit {

  @Input() activeIcon: string;
  @Input() activeLabel: string;
  
  @Input() inactiveIcon: string;
  @Input() inactiveLabel: string;

  @Input() isActive = true;

  @Output() changed = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {}

  toggle() {
    this.isActive = !this.isActive;
    this.changed.emit(this.isActive);
  }

}
