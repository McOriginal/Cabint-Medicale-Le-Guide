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
  Input,
  Row,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { useAllMedicament } from '../../Api/queriesMedicament';
import { useCreateOrdonnance } from '../../Api/queriesOrdonnance';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import imgMedicament from './../../assets/images/medicament.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { useOneTraitement } from '../../Api/queriesTraitement';

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
        return prevCart.map((item) =>
          item.ordonnance?._id === ordonnance?._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      //  Sinon on ajoute le produit avec la quantité (1)
      return [
        ...prevCart,
        { ordonnance, quantity: 1, customerPrice: ordonnance.price },
      ];
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

  // Fonction pour vider les produits dans le panier
  const clearCart = () => {
    setOrdonnanceItems([]);
  };

  // Fonction pour calculer le total des élements dans le panier
  const totalAmount = ordonnanceItems.reduce(
    (total, item) => total + item.customerPrice * item.quantity,
    0
  );

  // Validation de commande et AJOUTE DANS LA BASE DE DONNEES
  const handleSubmitOrder = () => {
    // Vérification de quantité dans le STOCK
    if (ordonnanceItems.length === 0) return;

    setIsSubmitting(true);
    const payload = {
      items: ordonnanceItems.map((item) => ({
        medicaments: item.ordonnance?._id,
        quantity: item.quantity,
        customerPrice: item.customerPrice,
      })),
      totalAmount,
      traitement: selectedTraitement?._id, // ou autre choix si tu ajoutes un select
    };

    createOrdonnance(payload, {
      onSuccess: () => {
        // Après on vide le panier
        clearCart();
        successMessageAlert('Ordonnance validée avec succès !');
        setIsSubmitting(false);

        // Rédirection sur la page PAIEMENT
        navigate('/paiements');
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
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Traitements'
            breadcrumbItem='Nouvelle Odonnance'
          />

          <Row className='flex-column-reverse flex-column-reverse flex-sm-row'>
            {/* Liste des produits */}
            <Col sm={7}>
              {/* Champ de Recherche */}
              <div className='col-sm my-4 jusftify-content-sm-between d-flex align-items-center gap-3 flex-wrap'>
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
            {/* --------------------- Panier---------------------------------------- */}
            {/* ------------------------------------------------------------- */}

            <Col sm={5}>
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
                      onClick={handleSubmitOrder}
                    >
                      Valide
                    </Button>
                  </div>
                </div>
              )}
              <Card>
                <CardBody>
                  <CardTitle className='mb-4'>
                    <div className='d-flex justify-content-between align-items-center'>
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
                          {/* {item?.quantity} ×{' '}
                          {formatPrice(item?.ordonnance?.price)} F ={' '}
                          {formatPrice(
                            item?.ordonnance?.price * item?.quantity
                          )}{' '}
                          F */}
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
                    </div>
                  ))}
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
