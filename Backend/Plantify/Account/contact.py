from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def contact_us(request):
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')
        
        # Compose email
        subject = f'Contact Form Submission from {name}'
        email_message = f'''
        Name: {name}
        Email: {email}
        Message: {message}
        '''
        
        # Send email
        send_mail(
            subject=subject,
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['amansahu47388@gmail.com'],
            fail_silently=False,
        )
        
        return Response({'message': 'Email sent successfully!'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
