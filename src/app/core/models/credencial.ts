export interface ICredencial {
  username : string;
  password : string;
}

export interface IUsuario {
  usuario : string;
  token: string;
}

export interface IUsuarioCadastro {
  name: string;
  email: string;
  username : string;
  password: string;
}

export interface IUsuarioAtualizacao {
  name: string;
  email: string;
  username : string;
  password: string;
  newPassword: string;
}

