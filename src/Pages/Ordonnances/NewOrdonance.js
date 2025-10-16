import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPrice,
  RequiredFormField,
} from '../components/capitalizeFunction';
import { useAllMedicament } from '../../Api/queriesMedicament';
import { useCreateOrdonnance } from '../../Api/queriesOrdonnance';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import imgMedicament from './../../assets/images/medicament.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { useOneTraitement } from '../../Api/queriesTraitement';
import { useFormik } from 'formik';
import showToastAlert from '../components/ToasMessage';

export default function NewOrdonance() {
  const { id } = useParams();

  // State de navigation
  const navigate = useNavigate();

  // Query pour le Traitement Sélectionné
  const { data: selectedTraitement } = useOneTraitement(id);

  // Query pour afficher les Médicament
  const { data: medicamentsData, isLoading, error } = useAllMedicament();

  // Recherche State
  const [searchTerm, setSearchTerm] = useState('');

  // Fontion pour Rechercher
  const filterSearchMedicaments = medicamentsData?.filter((medica) => {
    const search = searchTerm.toLowerCase();

    return (
      medica?.name.toString().toLowerCase().includes(search) ||
      medica?.price.toString().includes(search) ||
      medica?.stock.toString().includes(search)
    );
  });

  // Query pour ajouter une COMMANDE dans la base de données
  const { mutate: createOrdonnance } = useCreateOrdonnance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ajoute des produits dans le panier sans besoins de la base de données
  const [ordonnanceItems, setOrdonnanceItems] = useState([]);

  //  Fonction pour ajouter les produit dans base de données
  const addToCart = (ordonnance) => {
    setOrdonnanceItems((prevCart) => {
      // On vérifie si le produit n'existe pas déjà
      const existingItem = prevCart.find(
        (item) => item.ordonnance?._id === ordonnance?._id
      );

      //  Si le produit existe on incrémente la quantité
      if (existingItem) {
        const updateQty = prevCart.map((item) =>
          item.ordonnance?._id === ordonnance?._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        showToastAlert(`Quantité: ${existingItem.quantity + 1}`);
        return updateQty;
      } else {
        showToastAlert('Ajouté au panier');
        //  Sinon on ajoute le produit avec la quantité (1)
        return [
          ...prevCart,
          {
            ordonnance,
            quantity: 1,
            customerPrice: ordonnance.price,
            protocole: ordonnance.protocole,
          },
        ];
      }
    });
  };

  // Fonction pour Diminuer la quantité dans le panier
  // Si la quantité est 1 alors on le supprime
  const decreaseQuantity = (ordonnanceId) => {
    setOrdonnanceItems((prevCart) =>
      prevCart
        .map((item) =>
          item.ordonnance?._id === ordonnanceId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Fonction pour augmenter la quantité dans le panier
  const increaseQuantity = (ordonnanceId) => {
    setOrdonnanceItems((prevCart) =>
      prevCart.map((item) =>
        item.ordonnance?._id === ordonnanceId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Supprimer un produit du panier
  const removeFromCart = (Id) => {
    setOrdonnanceItems((prevCart) =>
      prevCart.filter((item) => item.ordonnance._id !== Id)
    );
  };

  // Fonction pour vider les produits dans le panier
  const clearCart = () => {
    setOrdonnanceItems([]);
    validation.resetForm();
  };

  // Fonction pour calculer le total des élements dans le panier
  const totalAmount = ordonnanceItems.reduce(
    (total, item) => total + item.customerPrice * item.quantity,
    0
  );

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      ordonnanceDate: new Date().toISOString().split('T')[0],
    },

    validationSchema: Yup.object({
      ordonnanceDate: Yup.date().required(
        "La date de l'Ordonnance est obligatoire"
      ),
    }),

    onSubmit: (values, { resetForm }) => {
      // Vérification de quantité dans le STOCK
      if (ordonnanceItems?.length === 0) return;

      const hasMissingProtocole = ordonnanceItems.some(
        (item) => !item.protocole || item.protocole.trim() === ''
      );

      if (hasMissingProtocole) {
        errorMessageAlert('Veuillez saisir le protocole de médicament.');
        return;
      }

      setIsSubmitting(true);
      const payload = {
        items: ordonnanceItems.map((item) => ({
          medicaments: item.ordonnance?._id,
          quantity: item.quantity,
          customerPrice: item.customerPrice,
          protocole: item.protocole,
        })),
        totalAmount,
        traitement: selectedTraitement?._id,
        ordonnanceDate: values.ordonnanceDate,
      };

      createOrdonnance(payload, {
        onSuccess: () => {
          // Après on vide le panier
          clearCart();
          successMessageAlert('Ordonnance Enregistrée avec succès !');
          setIsSubmitting(false);
          resetForm();
          // Rédirection sur la page PAIEMENT
          navigate('/ordonnances');
        },
        onError: (err) => {
          const message =
            err?.response?.data?.message ||
            err ||
            err?.message ||
            "Erreur lors de la validation de l'Ordonnance?.";
          errorMessageAlert(message);
          setIsSubmitting(false);
        },
      });
    },
  });

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Traitements'
            breadcrumbItem='Nouvelle Odonnance'
          />

          <Row>
            {/* ------------------------------------------------------------- */}
            {/* --------------------- Panier---------------------------------------- */}

            <Col sm={12}>
              <div>
                {isSubmitting && <LoadingSpiner />}

                {ordonnanceItems?.length > 0 && !isSubmitting && (
                  <div className='d-flex gap-4 mb-3'>
                    <Button
                      color='warning'
                      className='fw-bold'
                      onClick={clearCart}
                    >
                      <i className=' fas fa-window-close'></i>
                    </Button>

                    <div className='d-grid' style={{ width: '100%' }}>
                      <Button
                        color='primary'
                        className='fw-bold'
                        onClick={() => validation.handleSubmit()}
                      >
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Card style={{ height: '350px', overflowY: 'scroll' }}>
                <CardBody>
                  <CardTitle className='mb-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                      {/* Date de l'Ordonnance */}
                      <div>
                        <FormGroup className='mb-3'>
                          <Label className='form-label' for='ordonnanceDate'>
                            Date de l'Ordonnance <RequiredFormField />
                          </Label>
                          <Input
                            name='ordonnanceDate'
                            id='ordonnanceDate'
                            type='date'
                            className='form border-1 border-dark form-control'
                            placeholder="Date de l'Ordonnance"
                            max={new Date().toISOString().slice(0, 10)}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.ordonnanceDate || ''}
                            invalid={
                              validation.touched.ordonnanceDate &&
                              validation.errors.ordonnanceDate
                                ? true
                                : false
                            }
                          />
                          {validation.touched.ordonnanceDate &&
                          validation.errors.ordonnanceDate ? (
                            <FormFeedback type='invalid'>
                              {validation.errors.ordonnanceDate}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </div>
                      <h6>Ordonnance Patient</h6>
                      <h5 className='text-warning'>
                        Total : {formatPrice(totalAmount)} F
                      </h5>
                    </div>
                  </CardTitle>

                  {ordonnanceItems?.length === 0 && (
                    <p className='text-center'>
                      Veuillez cliquez sur un Médicament pour l'ajouter
                    </p>
                  )}
                  {ordonnanceItems?.map((item) => (
                    <div
                      key={item?.ordonnance?._id}
                      className='d-flex justify-content-between align-items-center mb-2 border-bottom border-black p-2 shadow shadow-md'
                    >
                      <div>
                        <strong>
                          {capitalizeWords(item?.ordonnance?.name)}
                        </strong>
                        <div>
                          Prix: client
                          <Input
                            type='number'
                            min={0}
                            value={item.customerPrice}
                            onChange={(e) => {
                              const newPrice = parseFloat(e.target.value) || 0;
                              setOrdonnanceItems((prevCart) =>
                                prevCart.map((i) =>
                                  i.ordonnance._id === item.ordonnance._id
                                    ? { ...i, customerPrice: newPrice }
                                    : i
                                )
                              );
                            }}
                            style={{
                              width: '100px',
                              border: '1px solid #cdc606 ',
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label for='protocole'>
                          Protocole <RequiredFormField />{' '}
                        </Label>
                        <Input
                          name='protocole'
                          id='protocole'
                          type='text'
                          className='form border-1 border-secondary form-control'
                          placeholder='Protocole de médicament'
                          onChange={(e) => {
                            const newProtocole = e.target.value || '';
                            setOrdonnanceItems((prevCart) =>
                              prevCart.map((i) =>
                                i.ordonnance._id === item.ordonnance._id
                                  ? { ...i, protocole: newProtocole }
                                  : i
                              )
                            );
                          }}
                        />
                      </div>
                      <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
                        <div className='d-flex gap-2'>
                          <Button
                            color='danger'
                            size='sm'
                            onClick={() =>
                              decreaseQuantity(item?.ordonnance?._id)
                            }
                          >
                            -
                          </Button>
                          <input
                            type='number'
                            min={1}
                            value={item.quantity}
                            onClick={(e) => e.stopPropagation()} // Évite le clic sur la carte
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value > 0) {
                                setOrdonnanceItems((prevCart) =>
                                  prevCart.map((i) =>
                                    i.ordonnance._id === item.ordonnance._id
                                      ? { ...i, quantity: value }
                                      : i
                                  )
                                );
                              }
                            }}
                            style={{
                              width: '60px',
                              textAlign: 'center',
                              border: '1px solid orange',
                              borderRadius: '5px',
                            }}
                          />
                          <Button
                            color='success'
                            size='sm'
                            onClick={() =>
                              increaseQuantity(item?.ordonnance?._id)
                            }
                          >
                            +
                          </Button>
                        </div>
                        {/* supprimer */}
                        <Button
                          color='danger'
                          size='sm'
                          onClick={() => removeFromCart(item.ordonnance?._id)}
                        >
                          <i className='fas fa-trash-alt'></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>
            {/* ------------------------------------------------------------- */}

            {/* Liste des produits */}
            <Col sm={12}>
              {/* Champ de Recherche */}
              <div className='col-sm my-4 justify-content-sm-between d-flex align-items-center gap-3 flex-wrap'>
                {/* Total Médicaments */}
                <Col className='col-sm-auto'>
                  <div className='d-flex align-items-center gap-2'>
                    <h5 className='mb-0'>Total Médicaments:</h5>
                    <span className='badge bg-info'>
                      {formatPrice(medicamentsData?.length) || 0}
                    </span>
                  </div>
                </Col>
                {/* Total Médicaments */}
                <div className='d-flex justify-content-sm-end gap-3'>
                  {searchTerm !== '' && (
                    <Button color='warning' onClick={() => setSearchTerm('')}>
                      <i className='fas fa-window-close'></i>
                    </Button>
                  )}

                  <div className='search-box me-4'>
                    <input
                      type='text'
                      className='form-control search border border-dark rounded'
                      placeholder='Rechercher...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ----------------------------------------- */}
              {/* ------------- Liste de Médicaments---------------------------- */}
              {/* ----------------------------------------- */}
              <Card>
                <CardBody>
                  {isLoading && <LoadingSpiner />}
                  {error && (
                    <div className='text-danger text-center'>
                      Une erreur est survenue ! Veuillez actualiser la page.
                    </div>
                  )}

                  {!error &&
                    !isLoading &&
                    filterSearchMedicaments?.length === 0 && (
                      <div className='text-center'>
                        Aucun Médicament disponible
                      </div>
                    )}

                  <Row>
                    {!error &&
                      filterSearchMedicaments?.length > 0 &&
                      filterSearchMedicaments?.map((ordonnance) => (
                        <Col md={4} key={ordonnance?._id}>
                          <Card
                            className='shadow shadow-lg'
                            onClick={() => addToCart(ordonnance)}
                            style={{ cursor: 'pointer' }}
                          >
                            <CardImg
                              style={{
                                height: '100px',
                                objectFit: 'contain',
                              }}
                              src={
                                ordonnance?.imageUrl
                                  ? ordonnance?.imageUrl
                                  : imgMedicament
                              }
                              alt={ordonnance?.name}
                            />
                            <CardBody>
                              <CardText className='text-center'>
                                {capitalizeWords(ordonnance?.name)}
                              </CardText>
                              <CardText className='text-center fw-bold'>
                                Stock:{' '}
                                {ordonnance?.stock >= 10 ? (
                                  <span className='text-primary'>
                                    {' '}
                                    {ordonnance?.stock}{' '}
                                  </span>
                                ) : (
                                  <span className='text-danger'>
                                    {' '}
                                    {ordonnance?.stock}{' '}
                                  </span>
                                )}
                              </CardText>
                              <CardText className='text-center fw-bold'>
                                {formatPrice(ordonnance?.price)} F
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* ------------------------------------------------------------- */}
            {/* ------------------------------------------------------------- */}
            {/* ------------------------------------------------------------- */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
