export interface signUpvalues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  export interface useSignUpReturn {
    error: string | null;
    loading: boolean | null;
    registerUser: (values: signUpvalues) => Promise<void>;
  }


  export interface IPost {
    _id: string;
    userId: string;
    username?: string;
    title: string;
    content: string;
    img?: string[];
    createdAt: string;
  }
  
  
   export interface loginValues {
      email: string;
      password: string;
    }
  
    
   export interface useLoginreturn {
      error: string | null;
      loading: boolean | null;
      loginUser: (values: loginValues) => Promise<void>;
    }