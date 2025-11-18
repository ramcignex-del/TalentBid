import OpenAI from 'openai'

const apiKey = process.env.EMERGENT_LLM_KEY || 'sk-placeholder-key'
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://llm.stagingllm.com/api/openai/v1',
})

// Check if API is properly configured
const isConfigured = process.env.EMERGENT_LLM_KEY && process.env.EMERGENT_LLM_KEY !== 'sk-placeholder-key'

export async function extractSkillsFromResume(resumeText: string): Promise<string[]> {
  if (!isConfigured) {
    console.warn('OpenAI not configured, returning empty skills')
    return []
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer. Extract relevant skills from the resume text. Return only a JSON array of skill strings, nothing else.',
        },
        {
          role: 'user',
          content: `Extract the key skills from this resume text:\n\n${resumeText}`,
        },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content || '[]'
    const skills = JSON.parse(content)
    return Array.isArray(skills) ? skills : []
  } catch (error) {
    console.error('Error extracting skills:', error)
    return []
  }
}

export async function generateProfileSummary(candidateData: {
  fullName: string
  skills: string[]
  experienceYears: number
  education?: string
  bio?: string
}): Promise<string> {
  if (!isConfigured) {
    return `Experienced professional with ${candidateData.experienceYears} years in ${candidateData.skills.slice(0, 3).join(', ')}. ${candidateData.bio || 'Passionate about delivering high-quality work.'}`
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: 'You are a professional profile writer. Create a compelling 2-3 sentence professional summary for a candidate based on their information.',
        },
        {
          role: 'user',
          content: `Create a professional summary for:\nName: ${candidateData.fullName}\nSkills: ${candidateData.skills.join(', ')}\nExperience: ${candidateData.experienceYears} years\nEducation: ${candidateData.education || 'N/A'}\nBio: ${candidateData.bio || 'N/A'}`,
        },
      ],
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error generating summary:', error)
    return ''
  }
}

export async function generateRoleDescription(roleData: {
  title: string
  salary: number
  perks?: string[]
  companyName: string
}): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: 'You are a professional job description writer. Create an engaging role description based on the provided details. Keep it concise (2-3 paragraphs).',
        },
        {
          role: 'user',
          content: `Create a role description for:\nRole: ${roleData.title}\nCompany: ${roleData.companyName}\nSalary: $${roleData.salary}\nPerks: ${roleData.perks?.join(', ') || 'Standard benefits'}`,
        },
      ],
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error generating role description:', error)
    return ''
  }
}

export async function calculateMatchScore(candidateData: {
  skills: string[]
  experienceYears: number
  minSalary: number
}, bidData: {
  roleTitle: string
  salaryOffer: number
  roleDescription: string
}): Promise<number> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR matching system. Calculate a match score between a candidate and a role on a scale of 0-100. Consider skills alignment, experience, and salary expectations. Return only a number between 0 and 100.',
        },
        {
          role: 'user',
          content: `Calculate match score:\n\nCandidate:\nSkills: ${candidateData.skills.join(', ')}\nExperience: ${candidateData.experienceYears} years\nMinimum Salary: $${candidateData.minSalary}\n\nRole:\nTitle: ${bidData.roleTitle}\nSalary Offer: $${bidData.salaryOffer}\nDescription: ${bidData.roleDescription}`,
        },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content || '50'
    const score = parseInt(content.match(/\d+/)?.[0] || '50')
    return Math.min(100, Math.max(0, score))
  } catch (error) {
    console.error('Error calculating match score:', error)
    return 50
  }
}
