export interface AuthUserDTO {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface AuthResponseDTO {
  token: string;
  user: AuthUserDTO;
}
