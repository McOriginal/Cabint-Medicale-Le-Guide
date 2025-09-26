import React, { useState } from 'react';

import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from 'reactstrap';

import { Link, useNavigate } from 'react-router-dom';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useLogin } from '../../Api/queriesAuth';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';
import { hospitalName, logoMedical } from '../Logo/logo';

const Login = () => {
  document.title = 'Connexion | Santé MARHABA ';

  // Query de Login
  const { mutate: loginUser } = useLogin();
  // State de chargement des données
  const [isLoading, setIsLoading] = useState(false);

  // State de Navigation
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // handle show password toggle
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Veuillez entrer votre Email'),
      password: Yup.string().required('Veuillez entrer votre mot de passe'),
    }),
    onSubmit: (values, { resetForm }) => {
      // Désactiver le bouton de soumission pour éviter les doubles clics
      setIsLoading(true);

      // Appel de la mutation pour se connecter
      loginUser(values, {
        onSuccess: () => {
          setIsLoading(false);

          resetForm();
          // Afficher un message de succès ou une alerte
          successMessageAlert('Connexion réussie !');
          // Redirection vers le tableau de bord
          setTimeout(() => {
            try {
              const authUser = localStorage.getItem('authUser');
              const dataParse = JSON.parse(authUser);
              const role = dataParse?.user?.role;

              if (!role) {
                return errorMessageAlert('Rôle utilisateur introuvable.');
              }

              switch (role) {
                case 'admin':
                  navigate('/dashboard');
                  break;
                case 'medecin':
                  navigate('/dashboard-medecin');
                  break;
                case 'secretaire':
                  navigate('/dashboard-secretaire');
                  break;
                default:
                  errorMessageAlert('Rôle non reconnu.');
              }
              // Recharger la page pour mettre à jour l'état de l'application
              // Cela peut être utile si vous avez des données qui doivent être rafraîchies
              // mais dans ce cas, on utilise navigate pour aller à la bonne page
              window.location.reload();

              // -----------------------
            } catch (err) {
              errorMessageAlert('Erreur de redirection.');
            }
          }, 2000);
        },
        onError: (error) => {
          setIsLoading(false);
          const errorMessage =
            error?.response?.data?.message ||
            error ||
            'Une erreur est survenue lors de la connexion.';
          errorMessageAlert(errorMessage);
        },
      });
    },
  });

  return (
    <React.Fragment>
      <div className='bg-login'>
        <div className='bg-overlay'></div>
        <div className='account-pages  pt-5 '>
          <Container>
            <Row className='justify-content-center'>
              <Col lg={6} md={8} xl={4}>
                <Card className='border border-info border-2'>
                  <CardBody className='p-4'>
                    <div>
                      <div className='text-center'>
                        <img
                          src={logoMedical}
                          alt=''
                          height='54'
                          className='auth-logo logo-dark mx-auto'
                        />
                      </div>
                      <h4 className='font-size-18 text-info mt-2 text-center'>
                        {hospitalName}
                      </h4>
                      <p className='my-3 text-center'>
                        Entrez vos coordonnées pour vous connecter à votre
                        compte.
                      </p>
                      <Form
                        className='form-horizontal'
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row>
                          <Col md={12}>
                            <div className='mb-4'>
                              <Label className='form-label'>Email</Label>
                              <Input
                                name='email'
                                className='form-control border border-secondary'
                                placeholder='Enter email'
                                type='email'
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ''}
                                invalid={
                                  validation.touched.email &&
                                  validation.errors.email
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.email &&
                              validation.errors.email ? (
                                <FormFeedback type='invalid'>
                                  <div>{validation.errors.email}</div>
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className='mb-4'>
                              <Label className='form-label'>Mot de passe</Label>
                              <div className='d-flex gap-2 justify-content-center flex-nowrap  pb-3'>
                                <div className=' w-100'>
                                  <Input
                                    name='password'
                                    value={validation.values.password || ''}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Enter Password'
                                    className='form-controle border border-secondary'
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.password &&
                                      validation.errors.password
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.password &&
                                  validation.errors.password ? (
                                    <FormFeedback type='invalid'>
                                      <div> {validation.errors.password} </div>
                                    </FormFeedback>
                                  ) : null}
                                </div>

                                {/* Password visible */}
                                <div className='show-details '>
                                  <button
                                    className='btn btn-sm btn-secondary show-item-btn'
                                    type='button'
                                    onClick={handleShowPassword}
                                  >
                                    {showPassword ? (
                                      <i className='ri-eye-off-fill'></i>
                                    ) : (
                                      <i className='ri-eye-fill'></i>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className='text-md-center mt-3 mt-md-0'>
                              <Link
                                to='/forgotPassword'
                                className='text-warning'
                              >
                                <i className='mdi mdi-lock'></i> Mot de passe
                                oublié ?
                              </Link>
                            </div>

                            <div className='d-grid mt-4'>
                              {isLoading ? (
                                <LoadingSpiner />
                              ) : (
                                <button
                                  className='btn btn-info waves-effect waves-light'
                                  type='submit'
                                >
                                  Se Connecter
                                </button>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className='mt-5 text-center'>
                  <p className='text-white-50'>
                    © {new Date().getFullYear()} Santé MARHABA |{' '}
                    <i className='mdi mdi-heart text-danger'></i> Créé Par{' '}
                    <Link to={'https://www.cissemohamed.com'} target='blank'>
                      Cisse Mohamed
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
