import supertest from 'supertest';
import 'jest-extended';
import app from '../../src/app';
import {jeuRoutes} from "../../src/routes/jeuRouter";

const request = supertest(app);

const testNom1 = 'Jean-Marc';

describe('baseRoute', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
  });

});

describe('/stats', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/stats');
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
  });

  it('devrait tester le ratio de victoire', async () => {
    // Test exhaustif pour couvrir les deux branches
    await request.get('/api/v1/jeu/redemarrerJeu');

    // Créer un joueur avec 0 lancers
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'j0' });

    // Créer un joueur avec > 0 lancers
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'j1' });
    await request.get('/api/v1/jeu/jouer/j1');

    // Traite les deux types de joueurs
    const response = await request.get('/stats');
    expect(response.status).toBe(200);
    expect(response.text).toContain('j0');
    expect(response.text).toContain('j1');
  });

});

describe('/signin (déjà connecté)', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/signin');
    expect(response.status).toBe(302);
    expect(response.text).toBe("Found. Redirecting to /");
  });

});

describe('/signout', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/signout');
    expect(response.status).toBe(302);
    expect(response.text).toBe("Found. Redirecting to /");
  });

});

describe('/signin (déconnecté)', () => {

  it('devrait avoir un contenu HTML', async () => {
    const response = await request.get('/signin');
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
  });

});

describe('GET /bo/gu/s/URL/', () => {
  it(`devrait répondre avec une mauvaise demande lorsque l'URL est mauvais`, async () => {
    const response = await request.get('/bo/gu/s/URL/' + testNom1);
    expect(response.status).toBe(404);
  });
});
