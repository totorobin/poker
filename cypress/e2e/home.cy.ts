// https://docs.cypress.io/api/introduction/api.html

describe('Test main page', () => {

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('visits the app root url and set user name', () => {
    cy.visit('/')
    cy.get('[data-testid="userName"]').should('not.be.empty')
    cy.get('.user').get('.el-badge__content.el-badge__content--danger.is-fixed.is-dot')
    cy.get('.user').click()
    cy.get('.el-message-box__input').find('input').type('my name')
    cy.get('.el-button--primary').click()
    cy.get('.user').contains('my name')
  })


  it('visits the app root url with a saved user name', () => {
    window.localStorage.setItem('userName', 'toto')
    
    cy.visit('/')
    cy.get('.user').contains('toto')
    
  })
})
