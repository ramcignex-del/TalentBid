import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractSkillsFromResume } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and Word documents are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, new Uint8Array(arrayBuffer), {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath)

    // Extract skills from resume (basic text extraction for PDF/Word would need additional libraries)
    // For now, we'll skip automatic skill extraction
    let extractedSkills: string[] = []
    // In a real implementation, you'd extract text from the file first
    // const resumeText = await extractTextFromFile(file)
    // extractedSkills = await extractSkillsFromResume(resumeText)

    // Update candidate profile with resume URL
    const { data: candidate, error: updateError } = await supabase
      .from('candidates')
      .update({
        resume_url: urlData.publicUrl,
        resume_file_name: file.name,
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      // Delete uploaded file if database update fails
      await supabase.storage.from('resumes').remove([filePath])
      throw updateError
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: file.name,
      extractedSkills,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
