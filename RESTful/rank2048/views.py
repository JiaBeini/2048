from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse
from .models import Scores
from django.forms.models import model_to_dict
import json
import logging


# Create your views here.
def get_rank(request):
    logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
    logging.info(str(request))
    # print(request.POST)
    typee = request.POST.get('type')
    # print('rank', typee)
    logging.info(typee)
    scores = Scores.objects.filter(type=typee).order_by('-score', 'name')[:10]
    data = [model_to_dict(x) for x in scores]
    # data = serializers.serialize("json", scores)
    # print(data)
    # ls = [x.fidles for x in data]
    logging.info(str(typee))
    return JsonResponse({'result': json.dumps(data)}, safe=False)


def save_score(request):
    typee = request.POST.get('type')
    # print(typee)
    name = request.POST.get('name')
    score = float(request.POST.get('score'))
    ip = request.POST.get('ip', '0.0.0.0')
    print('ttt', name)
    ans = Scores.objects.filter(ip=ip, name=name, type=typee)
    if len(ans) > 0:
        if ans[0].score < score:
            ans.update(score=score)
    else:
        Scores.objects.create(ip=ip, name=name, type=typee, score=score)
    return JsonResponse({'result': 'success'})

def test(request):
    return JsonResponse({'test':'test'})
