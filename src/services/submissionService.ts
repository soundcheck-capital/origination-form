// Service pour vérifier l'état de soumission du formulaire via Make.com


class SubmissionService {
  private readonly webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.REACT_APP_SUBMISSION_STATUS_WEBHOOK || 'https://hook.us1.make.com/a7ors7wfsfuphlbq2xg8abuxpbtrvvgi';
  }

  /**
   * Vérifie si le formulaire a déjà été soumis
   * @returns Promise<boolean>
   */
  async checkSubmissionStatus(): Promise<boolean> {
    try {
      console.log('🔍 Vérification du statut de soumission...');
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            hubspotDealId: process.env.REACT_APP_HUBSPOT_DEAL_ID,
        })
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = JSON.parse(await response.text());
      
      // Utiliser la clé correcte retournée par Make.com
      return data.isFormSubmitted === true;

    } catch (error) {
      console.error('❌ Erreur lors de la vérification du statut:', error);
      
      // En cas d'erreur, assumer que le formulaire n'est pas soumis
      // pour ne pas bloquer l'utilisateur par erreur
      return false
      
    }
  }

  /**
   * Marquer le formulaire comme soumis (optionnel - si votre webhook le supporte)
   * @returns Promise<boolean>
   */
  async markAsSubmitted(): Promise<boolean> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_submitted',
          timestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme soumis:', error);
      return false;
    }
  }
}

export const submissionService = new SubmissionService();
export default submissionService;
