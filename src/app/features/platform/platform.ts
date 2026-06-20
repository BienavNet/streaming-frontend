import { Component } from '@angular/core';
import { PlatformTable } from "./components/platform-table/platform-table";

@Component({
  selector: 'app-platform',
  imports: [PlatformTable],
  templateUrl: './platform.html',
  styleUrl: './platform.css',
})
export class PlatformComponent {}
