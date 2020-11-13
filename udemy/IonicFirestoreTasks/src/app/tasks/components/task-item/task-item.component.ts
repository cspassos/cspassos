import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {

  @Input() task: Task;
  //concluir tarefa
  @Output() done = new EventEmitter<Task>();
  //atualizar tarefa
  @Output() update = new EventEmitter<Task>();
  //deletar tarefa
  @Output() delete = new EventEmitter<Task>();
}
