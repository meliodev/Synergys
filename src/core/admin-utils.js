import { db } from "../firebase"
import { generateId } from "./utils"

const products = [
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI"

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S MOYENNE TEMPERATURE TAILLE 4,3 KW",
        "description": "-",
        "price": 11571.56,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI"

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S MOYENNE TEMPERATURE TAILLE 6 KW",
        "description": "-",
        "price": 12110.90,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S MOYENNE TEMPERATURE TAILLE 8 KW",
        "description": "-",
        "price": 12649.29,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S MOYENNE TEMPERATURE TAILLE 11 KW",
        "description": "-",
        "price": 13727.96,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S MOYENNE TEMPERATURE TAILLE 14 KW",
        "description": "-",
        "price": 14805.69,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S MOYENNE TEMPERATURE TAILLE 16 KW",
        "description": "-",
        "price": 15789.57,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S80 HAUTE TEMPERATURE  TAILLE 11 KW",
        "description": "-",
        "price": 16530.81,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S80 HAUTE TEMPERATURE TAILLE 14 KW",
        "description": "-",
        "price": 17609.48,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S80 HAUTE TEMPERATURE  TAILLE 16 KW",
        "description": "-",
        "price": 18683.41,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S COMBI MOYENNE TEMPERATURE  TAILLE 4,3 KW ",
        "description": "-",
        "price": 13182.94,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S COMBI MOYENNE TEMPERATURE  TAILLE 6 KW",
        "description": "-",
        "price": 13722.27,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S COMBI MOYENNE TEMPERATURE  TAILLE 8 KW",
        "description": "-",
        "price": 14260.66,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S COMBI MOYENNE TEMPERATURE  TAILLE 11 KW",
        "description": "-",
        "price": 15339.34,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S COMBI MOYENNE TEMPERATURE  TAILLE 14 KW",
        "description": "-",
        "price": 16417.06,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI S COMBI MOYENNE TEMPERATURE  TAILLE 16 KW",
        "description": "-",
        "price": 17400.95,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI 80 COMBI HAUTE TEMPERATURE MOYENNE TEMPERATURE  TAILLE 11 KW",
        "description": "-",
        "price": 18142.18,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI"
        },
        "name": "PAC AIR EAU HITACHI YUTAKI 80 COMBI HAUTE TEMPERATURE MOYENNE TEMPERATURE  TAILLE 14 KW",
        "description": "-",
        "price": 19220.85,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "POMPE A CHALEUR AIR / EAU",
        "type": "produit",
        "brand": {
            "name": "HITACHI YUTAKI",

        },
        "name": "PAC AIR EAU HITACHI YUTAKI 80 COMBI HAUTE TEMPERATURE MOYENNE TEMPERATURE  TAILLE 16 KW",
        "description": "-",
        "price": 20294.79,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "-",
        "type": "option",
        "brand": {
            "name": "-",

        },
        "name": "AJOUTER UNE OPTION TRIPHASE",
        "description": "-",
        "price": 947.87,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "CHAUDIERE A GRANULES",
        "type": "produit",
        "brand": {
            "name": "FROLING PECO",

        },
        "name": "CHAUDIERE A GRANULES FROLING PECO 15 KW + Silo 300 KG",
        "description": "-",
        "price": 19895.73,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "CHAUDIERE A GRANULES",
        "type": "produit",
        "brand": {
            "name": "FROLING PECO",

        },
        "name": "CHAUDIERE A GRANULES FROLING PECO 20 KW + Silo 300 KG",
        "description": "-",
        "price": 20843.60,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "CHAUDIERE A GRANULES",
        "type": "produit",
        "brand": {
            "name": "FROLING PECO",

        },
        "name": "CHAUDIERE A GRANULES FROLING PECO 25 KW + Silo 300 KG",
        "description": "-",
        "price": 21791.47,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "CHAUDIERE A GRANULES",
        "type": "produit",
        "brand": {
            "name": "FROLING PECO",

        },
        "name": "CHAUDIERE A GRANULES FROLING PECO 30 KW + Silo 300 KG",
        "description": "-",
        "price": 23687.20,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "CHAUDIERE A GRANULES",
        "type": "produit",
        "brand": {
            "name": "FROLING PECO",

        },
        "name": "CHAUDIERE A GRANULES FROLING PECO 35 KW + Silo 300 KG",
        "description": "-",
        "price": 24635.07,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "-",
        "type": "option",
        "brand": {
            "name": "-",

        },
        "name": "* OPTION SILO 500 KG",
        "description": "-",
        "price": 568.72,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "-",
        "type": "option",
        "brand": {
            "name": "-",

        },
        "name": "* OPTION SILO TEXTILE 2,4 TONNES",
        "description": "-",
        "price": 3317.54,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "-",
        "type": "option",
        "brand": {
            "name": "-",

        },
        "name": "* OPTION SILO TEXTILE 3,7 TONNES",
        "description": "-",
        "price": 4028.44,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "-",
        "type": "option",
        "brand": {
            "name": "-",

        },
        "name": "* OPTION SILO TEXTILE 3,7 TONNES",
        "description": "-",
        "price": 4928.91,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "-",
        "type": "option",
        "brand": {
            "name": "-",

        },
        "name": "* OPTION TRIPHASE",
        "description": "-",
        "price": 947.87,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "EAU CHAUDE SANITAIRE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Chauffe-eau thermodynamique Monobloc BOURGEOIS GLOBAL 200 L",
        "description": "-",
        "price": 2834.12,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "EAU CHAUDE SANITAIRE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Chauffe-eau thermodynamique Monobloc BOURGEOIS GLOBAL 270 L",
        "description": "-",
        "price": 2985.78,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "EAU CHAUDE SANITAIRE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Chauffe-eau thermodynamique Bi-bloc HITACHI Yutampo 200 L",
        "description": "-",
        "price": 3507.11,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "EAU CHAUDE SANITAIRE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Chauffe-eau thermodynamique Bi-bloc HITACHI Yutampo 270 L",
        "description": "-",
        "price": 3862.56,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "EAU CHAUDE SANITAIRE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "CESI ALLIANTZ 1 capteur 200 L surface 2m² (jusqu’à 2 personnes dans le foyer)",
        "description": "-",
        "price": 5450.24,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "EAU CHAUDE SANITAIRE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "CESI ALLIANTZ 2 capteurs 300 L surface 4m² (à partir de 3 personnes dans le foyer)",
        "description": "-",
        "price": 6625.59,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "PRODUITS",
        "type": "produit",
        "brand": {
            "name": "DOMEO",

        },
        "name": "VMC Double flux Domeo 210",
        "description": "-",
        "price": 5336.49,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "PRODUITS",
        "type": "produit",
        "brand": {
            "name": "ALLIANTZ",

        },
        "name": "Système solaire combiné ALLIANTZ 5 capteurs surface 10m²",
        "description": "-",
        "price": 11848.34,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "PRODUITS",
        "type": "produit",
        "brand": {
            "name": "STOVE ITALIA MARINA",

        },
        "name": "Poêle à granulés STOVE ITALIA MARINA 8 KW",
        "description": "-",
        "price": 4162.09,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "PRODUITS",
        "type": "produit",
        "brand": {
            "name": "STOVE ITALIA MARINA",

        },
        "name": "Poêle à granulés STOVE ITALIA GIULIA 9 KW",
        "description": "-",
        "price": 4729.86,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "PRODUITS",
        "type": "produit",
        "brand": {
            "name": "STOVE ITALIA MARINA",

        },
        "name": "Poêle à granulés STOVE ITALIA PAOLA 12 KW",
        "description": "-",
        "price": 5109.00,
        "taxe": 5.5,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "KIT PANNEAUX SOLAIRE + FHE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Kit 1,5 Kwc BOURGEOIS GLOBAL 4 module 375 Kwc + 1 Micro onduleur BOURGEOIS GLOBAL",
        "description": "-",
        "price": 5545.45,
        "taxe": 10,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "KIT PANNEAUX SOLAIRE + FHE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Kit 3 Kwc BOURGEOIS GLOBAL  8 module 375 Kwc + 2 Micro onduleur BOURGEOIS GLOBAL",
        "description": "-",
        "price": 9081.82,
        "taxe": 10,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "KIT PANNEAUX SOLAIRE + FHE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Kit 4,5 Kwc BOURGEOIS GLOBAL 12 module 375 Kwc + 3 Micro onduleur BOURGEOIS GLOBAL",
        "description": "-",
        "price": 12708.33,
        "taxe": 20,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "KIT PANNEAUX SOLAIRE + FHE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Kit 6 Kwc BOURGEOIS GLOBAL 16 module 375 Kwc + 4 Micro onduleur BOURGEOIS GLOBAL",
        "description": "-",
        "price": 15000.00,
        "taxe": 20,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "KIT PANNEAUX SOLAIRE + FHE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Kit 7,5 Kwc BOURGEOIS GLOBAL 20 module 375 Kwc + 5 Micro onduleur BOURGEOIS GLOBAL",
        "description": "-",
        "price": 18325.00,
        "taxe": 20,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "KIT PANNEAUX SOLAIRE + FHE",
        "type": "produit",
        "brand": {
            "name": "BOURGEOIS GLOBAL",

        },
        "name": "Kit 9 Kwc BOURGEOIS GLOBAL  24 module 375 Kwc + 6 Micro onduleur BOURGEOIS GLOBAL",
        "description": "-",
        "price": 19991.67,
        "taxe": 20,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "KIT PANNEAUX SOLAIRE + FHE",
        "type": "produit",
        "brand": {
            "name": "DUAL SUN",

        },
        "name": "Kit DUAL SUN 3 Kwc 4 module 375 Kwc + 4 modules Photovoltaiques 375 Kwc + 2 micro onduleur + ballon 200 l",
        "description": "-",
        "price": 16354.55,
        "taxe": 10,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    },
    {
        "ID": "",
        "category": "KIT PANNEAUX SOLAIRE + FHE",
        "type": "produit",
        "brand": {
            "name": "DUAL SUN",

        },
        "name": "Kit DUAL SUN 3 Kwc 4 module 375 Kwc + 4 modules Photovoltaiques 375 Kwc + 2 micro onduleur + ballon 300 l",
        "description": "-",
        "price": 17263.64,
        "taxe": 10,
        "createdBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "createdAt": "2021-09-25T10:03:06+01:00",
        "editedBy": {
            "id": "GS-US-F4TB",
            "fullName": "Salim Lyo",
            "email": "sa.lyoussi@gmail.com",
            "phone": "",
            "role": "Admin"
        },
        "editedAt": "2021-09-25T10:03:06+01:00",
        "deleted": false
    }
]

const categories = [
    { name: "POMPE A CHALEUR AIR / EAU" },
    { name: "CHAUDIERE A GRANULES" },
    { name: "EAU CHAUDE SANITAIRE" },
    { name: "PRODUITS" },
    { name: "KIT PANNEAUX SOLAIRE + FHE" },
]

export const setProducts = () => {
    try {
        for (const p of products) {
            const id = generateId('GS-AR-')
            db.collection('Products').doc(id).set(p, { merge: true })
        }
    }
    catch (e) {
        console.log('error', e)
    }
}

export const setCategories = () => {
    try {
        for (const c of categories) {
            const id = generateId('GS-CAT-')
            db.collection('ProductCategories').doc(id).set(c, { merge: true })
        }
    }
    catch (e) {
        console.log('error', e)
    }
}