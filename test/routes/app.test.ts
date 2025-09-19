import supertest from 'supertest';
import 'jest-extended';
import app from '../../src/app';

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

  it('devrait calculer correctement le ratio pour un joueur sans lancers', async () => {
    // D'abord redémarrer le jeu pour avoir un état propre
    await request.get('/api/v1/jeu/redemarrerJeu');

    // Créer un joueur sans jouer (ratio = 0)
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: 'JoueurSansLancer' });

    const response = await request.get('/stats');
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    // Vérifier que la page se charge correctement même avec un joueur qui n'a pas joué
    expect(response.text).toContain('JoueurSansLancer');
    // Vérifier que le ratio est calculé comme 0.00000000 pour un joueur sans lancers
    expect(response.text).toContain('0.00000000');
  });

  it('devrait traiter correctement le cas où aucun joueur n existe', async () => {
    // Redémarrer pour avoir aucun joueur
    await request.get('/api/v1/jeu/redemarrerJeu');

    const response = await request.get('/stats');
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toContain('Pas de joueurs encore');
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
