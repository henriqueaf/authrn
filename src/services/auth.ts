interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export function signIn(): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'asdlkjsdhaaskdjhsakdhasioudyiuey21u1367',
        user: {
          name: 'Henrique',
          email: 'henrique@teste.com.br',
        },
      });
    }, 2000);
  });
}
