import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { takeWhile } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/services/error.service';




@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  configs = {
    isLogin: true,
    actionText: 'Logar',
    buttonActionText: 'Criar Conta',
    isLoading: false
  };
  private nameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  private alive = true;

  @HostBinding('class.app-login-spinner') private applySpinnerClass = true;

  constructor(
    public authService: AuthService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.createForm();

  }

  createForm(): void  {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

  }

  onSubmit(): void {
    console.log(this.loginForm.value);

    this.configs.isLoading = true;

    const operation = (this.configs.isLogin)
      ? this.authService.loginUser(this.loginForm.value)
      : this.authService.cadastrarUser(this.loginForm.value);

    operation
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(res => {
          console.log('redirec...', res);
          const redirect: string =  this.authService.redirectUrl || '/dashboard';
          /** redirect com o router */
          console.log('redirect', redirect);
          this.router.navigate([redirect]);
          this.authService.redirectUrl = null;
          this.configs.isLoading = false;
        },
        err => {
          console.log(err);
          this.snackBar.open(this.errorService.getErrorMessage(err), 'Fechar', {duration: 5000, verticalPosition: 'top'});
          this.configs.isLoading = false;
        },
        () => console.log('completo')
      );
  }



  changeAction(): void {
    this.configs.isLogin = !this.configs.isLogin;
    this.configs.actionText = !this.configs.isLogin ? 'Cadastrar' : 'Logar';
    this.configs.buttonActionText = !this.configs.isLogin ? 'Já tenho uma conta' : 'Criar Conta';
    !this.configs.isLogin ?  this.loginForm.addControl('name', this.nameControl) : this.loginForm.removeControl('name');
  }

  get name(): FormControl { return this.loginForm.get('name') as FormControl; }
  get email(): FormControl {    return this.loginForm.get('email') as FormControl;  }
  get password(): FormControl {    return this.loginForm.get('password') as FormControl;  }

  onManterLogado(): void {
    this.authService.toggleManterLogado();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
